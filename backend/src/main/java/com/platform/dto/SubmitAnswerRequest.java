package com.platform.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record SubmitAnswerRequest(
        @NotNull(message = "Question ID is required")
        Long questionId,

        @NotBlank(message = "Answer text cannot be blank")
        String answerText
) {}
