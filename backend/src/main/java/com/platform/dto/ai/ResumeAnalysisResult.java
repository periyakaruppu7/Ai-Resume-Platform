package com.platform.dto.ai;

import java.util.List;

public record ResumeAnalysisResult(
        String candidateName,
        String contactEmail,
        String professionalSummary,
        List<String> technicalSkills,
        List<String> softSkills,
        List<WorkExperienceItem> workExperience,
        List<EducationItem> education
) {
    public record WorkExperienceItem(
            String company,
            String role,
            String duration,
            List<String> keyAchievements
    ) {}

    public record EducationItem(
            String degree,
            String institution,
            String year
    ) {}
}
