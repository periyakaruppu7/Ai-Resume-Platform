package com.platform.controller;

import com.platform.dto.ApplicationResponse;
import com.platform.dto.MatchRequest;
import com.platform.service.AiMatchingEngineService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/match")
public class MatchController {

    private final AiMatchingEngineService aiMatchingEngineService;

    public MatchController(AiMatchingEngineService aiMatchingEngineService) {
        this.aiMatchingEngineService = aiMatchingEngineService;
    }

    @PostMapping("/analyze")
    public ResponseEntity<ApplicationResponse> analyzeMatch(
            @Valid @RequestBody MatchRequest request,
            Authentication authentication
    ) {
        return ResponseEntity.ok(aiMatchingEngineService.analyzeMatch(request, authentication.getName()));
    }

    @GetMapping("/applications")
    public ResponseEntity<List<ApplicationResponse>> getUserApplications(Authentication authentication) {
        return ResponseEntity.ok(aiMatchingEngineService.getUserApplications(authentication.getName()));
    }

    @GetMapping("/applications/{id}")
    public ResponseEntity<ApplicationResponse> getApplicationById(
            @PathVariable Long id,
            Authentication authentication
    ) {
        return ResponseEntity.ok(aiMatchingEngineService.getApplicationById(id, authentication.getName()));
    }
}
