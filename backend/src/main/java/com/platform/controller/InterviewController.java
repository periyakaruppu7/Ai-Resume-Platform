package com.platform.controller;

import com.platform.dto.*;
import com.platform.service.InterviewService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/interviews")
public class InterviewController {

    private final InterviewService interviewService;

    public InterviewController(InterviewService interviewService) {
        this.interviewService = interviewService;
    }

    @PostMapping("/sessions")
    public ResponseEntity<InterviewSessionResponse> createSession(
            @RequestBody CreateSessionRequest request,
            Authentication authentication
    ) {
        return ResponseEntity.ok(interviewService.createSession(request, authentication.getName()));
    }

    @PostMapping("/answers")
    public ResponseEntity<InterviewQuestionResponse> submitAnswer(
            @Valid @RequestBody SubmitAnswerRequest request,
            Authentication authentication
    ) {
        return ResponseEntity.ok(interviewService.submitAnswer(request, authentication.getName()));
    }

    @GetMapping("/sessions")
    public ResponseEntity<List<InterviewSessionResponse>> getUserSessions(Authentication authentication) {
        return ResponseEntity.ok(interviewService.getUserSessions(authentication.getName()));
    }

    @GetMapping("/sessions/{id}")
    public ResponseEntity<InterviewSessionResponse> getSessionById(
            @PathVariable Long id,
            Authentication authentication
    ) {
        return ResponseEntity.ok(interviewService.getSessionById(id, authentication.getName()));
    }
}
