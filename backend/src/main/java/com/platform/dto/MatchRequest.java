package com.platform.dto;

import jakarta.validation.constraints.NotNull;

public record MatchRequest(
        @NotNull(message = "Resume ID is required")
        Long resumeId,

        @NotNull(message = "Job Description ID is required")
        Long jobDescriptionId
) {}
