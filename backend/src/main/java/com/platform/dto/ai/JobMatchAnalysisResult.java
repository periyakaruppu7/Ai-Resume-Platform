package com.platform.dto.ai;

import java.util.List;

public record JobMatchAnalysisResult(
        double overallMatchScore,
        List<String> matchedSkills,
        List<String> partialSkills,
        List<String> missingSkills,
        String skillMatrixSummary,
        List<String> atsRecommendations,
        List<String> resumeFixes
) {}
