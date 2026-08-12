package com.platform.controller;

import com.platform.dto.ResumeResponse;
import com.platform.service.ResumeService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/resumes")
public class ResumeController {

    private final ResumeService resumeService;

    public ResumeController(ResumeService resumeService) {
        this.resumeService = resumeService;
    }

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ResumeResponse> uploadResume(
            @RequestParam("file") MultipartFile file,
            Authentication authentication
    ) {
        return ResponseEntity.ok(resumeService.uploadResume(file, authentication.getName()));
    }

    @GetMapping
    public ResponseEntity<List<ResumeResponse>> getUserResumes(Authentication authentication) {
        return ResponseEntity.ok(resumeService.getUserResumes(authentication.getName()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResumeResponse> getResumeById(
            @PathVariable Long id,
            Authentication authentication
    ) {
        return ResponseEntity.ok(resumeService.getResumeById(id, authentication.getName()));
    }
}
