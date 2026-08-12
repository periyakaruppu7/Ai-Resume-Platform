package com.platform.service;

import com.platform.dto.ResumeResponse;
import com.platform.entity.Resume;
import com.platform.entity.User;
import com.platform.repository.ResumeRepository;
import com.platform.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ResumeService {

    private static final Logger log = LoggerFactory.getLogger(ResumeService.class);

    private final ResumeRepository resumeRepository;
    private final UserRepository userRepository;
    private final PdfParsingService pdfParsingService;

    @Value("${file.upload-dir:./uploads}")
    private String uploadDir;

    public ResumeService(
            ResumeRepository resumeRepository,
            UserRepository userRepository,
            PdfParsingService pdfParsingService
    ) {
        this.resumeRepository = resumeRepository;
        this.userRepository = userRepository;
        this.pdfParsingService = pdfParsingService;
    }

    @Transactional
    public ResumeResponse uploadResume(MultipartFile file, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userEmail));

        String rawText = pdfParsingService.extractText(file);
        String savedFilePath = saveFileToDisk(file);

        Resume resume = Resume.builder()
                .user(user)
                .fileName(file.getOriginalFilename())
                .filePath(savedFilePath)
                .rawText(rawText)
                .build();

        Resume saved = resumeRepository.save(resume);
        log.info("Saved resume with ID {} for user {}", saved.getId(), userEmail);

        return mapToResponse(saved);
    }

    public List<ResumeResponse> getUserResumes(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userEmail));

        return resumeRepository.findByUserOrderByCreatedAtDesc(user)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public ResumeResponse getResumeById(Long id, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userEmail));

        Resume resume = resumeRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new IllegalArgumentException("Resume not found with ID: " + id));

        return mapToResponse(resume);
    }

    private String saveFileToDisk(MultipartFile file) {
        try {
            Path targetLocation = Paths.get(uploadDir).toAbsolutePath().normalize();
            Files.createDirectories(targetLocation);

            String fileExtension = getFileExtension(file.getOriginalFilename());
            String storedFileName = UUID.randomUUID().toString() + (fileExtension.isEmpty() ? "" : "." + fileExtension);
            Path filePath = targetLocation.resolve(storedFileName);

            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            return filePath.toString();
        } catch (IOException e) {
            log.error("Failed to store file to disk: {}", e.getMessage(), e);
            throw new RuntimeException("Could not store file on server.", e);
        }
    }

    private String getFileExtension(String filename) {
        if (filename == null || !filename.contains(".")) return "";
        return filename.substring(filename.lastIndexOf(".") + 1);
    }

    private ResumeResponse mapToResponse(Resume resume) {
        return new ResumeResponse(
                resume.getId(),
                resume.getFileName(),
                resume.getFilePath(),
                resume.getRawText(),
                resume.getParsedJson(),
                resume.getCreatedAt()
        );
    }
}
