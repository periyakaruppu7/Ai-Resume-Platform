package com.platform.dto;

import jakarta.validation.constraints.NotBlank;

public record RagQueryRequest(
        Long documentId,

        @NotBlank(message = "Question text cannot be blank")
        String questionText
) {}
