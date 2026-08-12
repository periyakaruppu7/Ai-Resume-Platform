package com.platform.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "applications")
public class Application {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resume_id", nullable = false)
    private Resume resume;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_description_id", nullable = false)
    private JobDescription jobDescription;

    @Column(name = "match_score")
    private Double matchScore;

    @Lob
    @Column(name = "skill_analysis", columnDefinition = "LONGTEXT")
    private String skillAnalysis;

    @Lob
    @Column(name = "ats_recommendations", columnDefinition = "LONGTEXT")
    private String atsRecommendations;

    @Column(length = 50)
    private String status = "ANALYZED";

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public Application() {
    }

    public Application(Long id, User user, Resume resume, JobDescription jobDescription, Double matchScore, String skillAnalysis, String atsRecommendations, String status, LocalDateTime createdAt) {
        this.id = id;
        this.user = user;
        this.resume = resume;
        this.jobDescription = jobDescription;
        this.matchScore = matchScore;
        this.skillAnalysis = skillAnalysis;
        this.atsRecommendations = atsRecommendations;
        this.status = status != null ? status : "ANALYZED";
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Resume getResume() { return resume; }
    public void setResume(Resume resume) { this.resume = resume; }

    public JobDescription getJobDescription() { return jobDescription; }
    public void setJobDescription(JobDescription jobDescription) { this.jobDescription = jobDescription; }

    public Double getMatchScore() { return matchScore; }
    public void setMatchScore(Double matchScore) { this.matchScore = matchScore; }

    public String getSkillAnalysis() { return skillAnalysis; }
    public void setSkillAnalysis(String skillAnalysis) { this.skillAnalysis = skillAnalysis; }

    public String getAtsRecommendations() { return atsRecommendations; }
    public void setAtsRecommendations(String atsRecommendations) { this.atsRecommendations = atsRecommendations; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id;
        private User user;
        private Resume resume;
        private JobDescription jobDescription;
        private Double matchScore;
        private String skillAnalysis;
        private String atsRecommendations;
        private String status = "ANALYZED";
        private LocalDateTime createdAt;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder user(User user) { this.user = user; return this; }
        public Builder resume(Resume resume) { this.resume = resume; return this; }
        public Builder jobDescription(JobDescription jobDescription) { this.jobDescription = jobDescription; return this; }
        public Builder matchScore(Double matchScore) { this.matchScore = matchScore; return this; }
        public Builder skillAnalysis(String skillAnalysis) { this.skillAnalysis = skillAnalysis; return this; }
        public Builder atsRecommendations(String atsRecommendations) { this.atsRecommendations = atsRecommendations; return this; }
        public Builder status(String status) { this.status = status; return this; }
        public Builder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public Application build() {
            return new Application(id, user, resume, jobDescription, matchScore, skillAnalysis, atsRecommendations, status, createdAt);
        }
    }
}
