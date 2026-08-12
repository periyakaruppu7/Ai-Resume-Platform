package com.platform.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.platform.dto.ApplicationResponse;
import com.platform.dto.MatchRequest;
import com.platform.dto.ai.JobMatchAnalysisResult;
import com.platform.entity.Application;
import com.platform.entity.JobDescription;
import com.platform.entity.Resume;
import com.platform.entity.User;
import com.platform.repository.ApplicationRepository;
import com.platform.repository.JobDescriptionRepository;
import com.platform.repository.ResumeRepository;
import com.platform.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.converter.BeanOutputConverter;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AiMatchingEngineService {

    private static final Logger log = LoggerFactory.getLogger(AiMatchingEngineService.class);

    private final ApplicationRepository applicationRepository;
    private final ResumeRepository resumeRepository;
    private final JobDescriptionRepository jobDescriptionRepository;
    private final UserRepository userRepository;
    private final ResumeParserAiService resumeParserAiService;
    private final ChatClient chatClient;
    private final ObjectMapper objectMapper;

    public AiMatchingEngineService(
            ApplicationRepository applicationRepository,
            ResumeRepository resumeRepository,
            JobDescriptionRepository jobDescriptionRepository,
            UserRepository userRepository,
            ResumeParserAiService resumeParserAiService,
            ChatClient chatClient,
            ObjectMapper objectMapper
    ) {
        this.applicationRepository = applicationRepository;
        this.resumeRepository = resumeRepository;
        this.jobDescriptionRepository = jobDescriptionRepository;
        this.userRepository = userRepository;
        this.resumeParserAiService = resumeParserAiService;
        this.chatClient = chatClient;
        this.objectMapper = objectMapper;
    }

    @Transactional
    public ApplicationResponse analyzeMatch(MatchRequest request, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userEmail));

        Resume resume = resumeRepository.findByIdAndUser(request.resumeId(), user)
                .orElseThrow(() -> new IllegalArgumentException("Resume not found with ID: " + request.resumeId()));

        JobDescription jd = jobDescriptionRepository.findByIdAndUser(request.jobDescriptionId(), user)
                .orElseThrow(() -> new IllegalArgumentException("Job Description not found with ID: " + request.jobDescriptionId()));

        // Ensure resume structured data is extracted
        if (resume.getParsedJson() == null || resume.getParsedJson().isBlank()) {
            resumeParserAiService.extractStructuredResumeData(resume);
        }

        JobMatchAnalysisResult matchResult = computeAiMatchScore(resume, jd);

        Application application = applicationRepository.findByResumeAndJobDescription(resume, jd)
                .orElse(Application.builder()
                        .user(user)
                        .resume(resume)
                        .jobDescription(jd)
                        .build());

        application.setMatchScore(matchResult.overallMatchScore());
        try {
            application.setSkillAnalysis(objectMapper.writeValueAsString(matchResult));
            application.setAtsRecommendations(objectMapper.writeValueAsString(matchResult.atsRecommendations()));
        } catch (Exception e) {
            log.error("Failed to map match analysis JSON", e);
        }
        application.setStatus("ANALYZED");

        Application saved = applicationRepository.save(application);
        log.info("Calculated ATS match score of {}% for Application ID {}", saved.getMatchScore(), saved.getId());

        return mapToResponse(saved);
    }

    public List<ApplicationResponse> getUserApplications(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userEmail));

        return applicationRepository.findByUserOrderByCreatedAtDesc(user)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public ApplicationResponse getApplicationById(Long id, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userEmail));

        Application application = applicationRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new IllegalArgumentException("Application not found with ID: " + id));

        return mapToResponse(application);
    }

    public JobMatchAnalysisResult computeAiMatchScore(Resume resume, JobDescription jd) {
        BeanOutputConverter<JobMatchAnalysisResult> converter = new BeanOutputConverter<>(JobMatchAnalysisResult.class);

        String systemPrompt = """
            You are an objective Applicant Tracking System (ATS) and Senior Technical Recruiter.
            
            Compare the provided CANDIDATE RESUME against the TARGET JOB DESCRIPTION.

            CRITICAL EVALUATION RULES:
            1. DO NOT fabricate, assume, or infer technical skills that are not explicitly present in the resume.
            2. If the candidate's field of experience is unrelated to the job domain (e.g., Boiler Operator / Chemical Industry applying for Software Engineering), the ATS match score MUST BE BELOW 15%.
            3. Fully Matched skills MUST appear in BOTH the resume text and job description.
            4. Missing skills MUST list key mandatory requirements from the job description that are completely absent in the resume.
            5. Base the match percentage strictly on: (Matching Required Skills / Total Required Skills) * 100.

            EXPECTED OUTPUT FORMAT:
            {format}
            """;

        String userPrompt = "--- [CANDIDATE RESUME TEXT] ---\n" + resume.getRawText() +
                "\n\n--- [TARGET JOB DESCRIPTION TEXT] ---\nTitle: " + jd.getTitle() + "\nText:\n" + jd.getRawText();

        try {
            String responseStr = chatClient.prompt()
                    .system(sp -> sp.text(systemPrompt).param("format", converter.getFormat()))
                    .user(userPrompt)
                    .call()
                    .content();

            return converter.convert(responseStr);
        } catch (Exception e) {
            log.warn("Spring AI LLM call unconfigured or failed ({}), computing dynamic heuristic match...", e.getMessage());
            return computeDynamicFallbackMatch(resume, jd);
        }
    }

    private JobMatchAnalysisResult computeDynamicFallbackMatch(Resume resume, JobDescription jd) {
        String resumeText = resume.getRawText() != null ? resume.getRawText().toLowerCase() : "";
        String jdText = jd.getRawText() != null ? jd.getRawText().toLowerCase() : "";

        // Common technology and domain keywords to evaluate
        List<String> knownKeywords = List.of(
                "java", "spring boot", "spring", "react", "javascript", "typescript", "python",
                "sql", "mysql", "postgresql", "docker", "kubernetes", "aws", "azure", "git",
                "rest apis", "rest api", "html", "css", "tailwind", "node.js", "c++", "c#",
                "boiler", "chemical", "operating", "welding", "plumbing", "maintenance", "machinery"
        );

        List<String> requiredInJd = knownKeywords.stream()
                .filter(jdText::contains)
                .collect(Collectors.toList());

        if (requiredInJd.isEmpty()) {
            requiredInJd = List.of("java", "spring boot", "react", "sql", "git");
        }

        List<String> matched = new ArrayList<>();
        List<String> missing = new ArrayList<>();

        for (String skill : requiredInJd) {
            if (resumeText.contains(skill)) {
                matched.add(capitalizeWord(skill));
            } else {
                missing.add(capitalizeWord(skill));
            }
        }

        double calculatedScore = 0.0;
        if (!requiredInJd.isEmpty()) {
            calculatedScore = ((double) matched.size() / requiredInJd.size()) * 100.0;
        }

        // Domain mismatch check: Boiler Operator / Chemical / Non-IT resume applying for Software Engineer job
        boolean isUnrelatedDomain = (resumeText.contains("boiler") || resumeText.contains("chemical") || resumeText.contains("machinery"))
                && (jdText.contains("java") || jdText.contains("software") || jdText.contains("developer") || jdText.contains("engineer"));

        if (isUnrelatedDomain && matched.size() <= 1) {
            calculatedScore = Math.min(calculatedScore, 8.0);
        }

        calculatedScore = Math.round(calculatedScore * 10.0) / 10.0;

        String summary = String.format("Dynamic ATS Evaluation: Candidate matched %d of %d identified job requirements. Overall compatibility is %.1f%%.",
                matched.size(), requiredInJd.size(), calculatedScore);

        List<String> recommendations = new ArrayList<>();
        if (!missing.isEmpty()) {
            recommendations.add("Acquire and highlight experience in missing skills: " + String.join(", ", missing));
        }
        recommendations.add("Quantify your professional achievements with metrics (e.g. improved system throughput by 30%).");

        List<String> fixes = new ArrayList<>();
        if (!missing.isEmpty()) {
            fixes.add("Add a targeted project section demonstrating hands-on usage of " + missing.get(0));
        }

        return new JobMatchAnalysisResult(
                calculatedScore,
                matched,
                List.of(),
                missing,
                summary,
                recommendations,
                fixes
        );
    }

    private String capitalizeWord(String str) {
        if (str == null || str.isEmpty()) return str;
        if (str.length() == 1) return str.toUpperCase();
        return Character.toUpperCase(str.charAt(0)) + str.substring(1);
    }

    private ApplicationResponse mapToResponse(Application app) {
        return new ApplicationResponse(
                app.getId(),
                app.getResume().getId(),
                app.getResume().getFileName(),
                app.getJobDescription().getId(),
                app.getJobDescription().getTitle(),
                app.getJobDescription().getCompanyName(),
                app.getMatchScore(),
                app.getSkillAnalysis(),
                app.getAtsRecommendations(),
                app.getStatus(),
                app.getCreatedAt()
        );
    }
}
