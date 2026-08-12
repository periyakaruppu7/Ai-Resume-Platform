package com.platform.dto;

import java.time.LocalDateTime;

public record ApplicationResponse(
        Long id,
        Long resumeId,
        String resumeFileName,
        Long jobDescriptionId,
        String jobTitle,
        String companyName,
        Double matchScore,
        String skillAnalysis,
        String atsRecommendations,
        String status,
        LocalDateTime createdAt
) {}
