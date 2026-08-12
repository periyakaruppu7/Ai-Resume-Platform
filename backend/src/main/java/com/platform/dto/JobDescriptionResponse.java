package com.platform.dto;

import java.time.LocalDateTime;

public record JobDescriptionResponse(
        Long id,
        String title,
        String companyName,
        String rawText,
        String parsedSkills,
        LocalDateTime createdAt
) {}
