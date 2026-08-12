package com.platform.dto.ai;

import java.util.List;

public record InterviewQuestionListResult(
        List<InterviewQuestionItem> questions
) {
    public record InterviewQuestionItem(
            String questionText,
            String targetSkill,
            String difficulty,
            String questionContext
    ) {}
}
