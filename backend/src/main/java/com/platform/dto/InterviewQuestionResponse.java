package com.platform.dto;

import java.util.List;

public record InterviewQuestionResponse(
        Long id,
        Long sessionId,
        String questionText,
        String targetSkill,
        String difficulty,
        String userAnswer,
        Integer correctnessScore,
        Integer clarityScore,
        List<String> missingConcepts,
        String idealResponse,
        String feedback
) {}
