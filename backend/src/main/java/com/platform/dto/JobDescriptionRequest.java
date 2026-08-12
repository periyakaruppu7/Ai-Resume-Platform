package com.platform.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record JobDescriptionRequest(
        @NotBlank(message = "Job title is required")
        String title,

        String companyName,

        @NotBlank(message = "Job description raw text is required")
        @Size(min = 50, message = "Job description must contain at least 50 characters")
        String rawText
) {}
