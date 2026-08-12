package com.platform.controller;

import com.platform.dto.JobDescriptionRequest;
import com.platform.dto.JobDescriptionResponse;
import com.platform.service.JobDescriptionService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/job-descriptions")
public class JobDescriptionController {

    private final JobDescriptionService jobDescriptionService;

    public JobDescriptionController(JobDescriptionService jobDescriptionService) {
        this.jobDescriptionService = jobDescriptionService;
    }

    @PostMapping
    public ResponseEntity<JobDescriptionResponse> createJobDescription(
            @Valid @RequestBody JobDescriptionRequest request,
            Authentication authentication
    ) {
        return ResponseEntity.ok(jobDescriptionService.createJobDescription(request, authentication.getName()));
    }

    @GetMapping
    public ResponseEntity<List<JobDescriptionResponse>> getUserJobDescriptions(Authentication authentication) {
        return ResponseEntity.ok(jobDescriptionService.getUserJobDescriptions(authentication.getName()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<JobDescriptionResponse> getJobDescriptionById(
            @PathVariable Long id,
            Authentication authentication
    ) {
        return ResponseEntity.ok(jobDescriptionService.getJobDescriptionById(id, authentication.getName()));
    }
}
