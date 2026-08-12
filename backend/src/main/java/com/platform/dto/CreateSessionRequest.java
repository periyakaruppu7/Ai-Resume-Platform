package com.platform.dto;

public record CreateSessionRequest(
        Long applicationId,
        Long resumeId,
        Long jobDescriptionId,
        String sessionTitle
) {}
