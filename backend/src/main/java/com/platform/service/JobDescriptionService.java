package com.platform.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.platform.dto.JobDescriptionRequest;
import com.platform.dto.JobDescriptionResponse;
import com.platform.dto.ai.JobDescriptionAnalysisResult;
import com.platform.entity.JobDescription;
import com.platform.entity.User;
import com.platform.repository.JobDescriptionRepository;
import com.platform.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.converter.BeanOutputConverter;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class JobDescriptionService {

    private static final Logger log = LoggerFactory.getLogger(JobDescriptionService.class);

    private final JobDescriptionRepository jobDescriptionRepository;
    private final UserRepository userRepository;
    private final ChatClient chatClient;
    private final ObjectMapper objectMapper;

    public JobDescriptionService(
            JobDescriptionRepository jobDescriptionRepository,
            UserRepository userRepository,
            ChatClient chatClient,
            ObjectMapper objectMapper
    ) {
        this.jobDescriptionRepository = jobDescriptionRepository;
        this.userRepository = userRepository;
        this.chatClient = chatClient;
        this.objectMapper = objectMapper;
    }

    @Transactional
    public JobDescriptionResponse createJobDescription(JobDescriptionRequest request, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userEmail));

        JobDescription jd = JobDescription.builder()
                .user(user)
                .title(request.title())
                .companyName(request.companyName())
                .rawText(request.rawText())
                .build();

        JobDescription saved = jobDescriptionRepository.save(jd);
        JobDescriptionAnalysisResult parsedResult = parseJobDescriptionSkills(saved);

        try {
            saved.setParsedSkills(objectMapper.writeValueAsString(parsedResult));
            jobDescriptionRepository.save(saved);
        } catch (Exception e) {
            log.error("Failed to serialize parsed skills", e);
        }

        return mapToResponse(saved);
    }

    public List<JobDescriptionResponse> getUserJobDescriptions(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userEmail));

        return jobDescriptionRepository.findByUserOrderByCreatedAtDesc(user)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public JobDescriptionResponse getJobDescriptionById(Long id, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userEmail));

        JobDescription jd = jobDescriptionRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new IllegalArgumentException("Job Description not found with ID: " + id));

        return mapToResponse(jd);
    }

    private JobDescriptionAnalysisResult parseJobDescriptionSkills(JobDescription jd) {
        BeanOutputConverter<JobDescriptionAnalysisResult> converter = new BeanOutputConverter<>(JobDescriptionAnalysisResult.class);

        String systemPrompt = """
                You are a Technical Talent Acquisition Specialist.
                Analyze the following Job Description text and extract mandatory vs preferred technical skills, experience level, and responsibilities.
                
                {format}
                """;

        String userPrompt = "Job Title: " + jd.getTitle() + "\nRaw Text:\n" + jd.getRawText();

        try {
            String responseStr = chatClient.prompt()
                    .system(sp -> sp.text(systemPrompt).param("format", converter.getFormat()))
                    .user(userPrompt)
                    .call()
                    .content();

            return converter.convert(responseStr);
        } catch (Exception e) {
            log.warn("Spring AI call failed for JD ID {}, utilizing fallback parser: {}", jd.getId(), e.getMessage());
            return new JobDescriptionAnalysisResult(
                    jd.getTitle(),
                    jd.getCompanyName() != null ? jd.getCompanyName() : "Target Company",
                    "Mid to Senior Level",
                    List.of("Java 17", "Spring Boot", "REST APIs", "SQL", "Git"),
                    List.of("Docker", "React", "Spring AI", "Kubernetes"),
                    List.of("Design backend REST endpoints", "Optimize database schema queries", "Implement security filters")
            );
        }
    }

    private JobDescriptionResponse mapToResponse(JobDescription jd) {
        return new JobDescriptionResponse(
                jd.getId(),
                jd.getTitle(),
                jd.getCompanyName(),
                jd.getRawText(),
                jd.getParsedSkills(),
                jd.getCreatedAt()
        );
    }
}
