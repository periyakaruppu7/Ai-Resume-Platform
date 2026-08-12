package com.platform.dto;

import java.time.LocalDateTime;
import java.util.List;

public record InterviewSessionResponse(
        Long id,
        String sessionTitle,
        String status,
        LocalDateTime createdAt,
        List<InterviewQuestionResponse> questions
) {}
