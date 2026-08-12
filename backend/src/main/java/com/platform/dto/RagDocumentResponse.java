package com.platform.dto;

import java.time.LocalDateTime;

public record RagDocumentResponse(
        Long id,
        String documentName,
        String fileType,
        Integer chunkCount,
        String status,
        LocalDateTime createdAt
) {}
