package com.platform.dto.ai;

import java.util.List;

public record JobDescriptionAnalysisResult(
        String jobTitle,
        String companyName,
        String experienceLevel,
        List<String> mandatorySkills,
        List<String> preferredSkills,
        List<String> keyResponsibilities
) {}
