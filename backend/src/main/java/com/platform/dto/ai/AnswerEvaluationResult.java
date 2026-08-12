package com.platform.dto.ai;

import java.util.List;

public record AnswerEvaluationResult(
        int correctnessScore,
        int clarityScore,
        List<String> missingConcepts,
        String idealResponse,
        String feedback
) {}
