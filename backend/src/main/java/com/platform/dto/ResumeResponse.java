package com.platform.dto;

import java.time.LocalDateTime;

public record ResumeResponse(
        Long id,
        String fileName,
        String filePath,
        String rawText,
        String parsedJson,
        LocalDateTime createdAt
) {}
