package com.platform.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "job_descriptions")
public class JobDescription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String title;

    @Column(name = "company_name")
    private String companyName;

    @Lob
    @Column(name = "raw_text", nullable = false, columnDefinition = "LONGTEXT")
    private String rawText;

    @Lob
    @Column(name = "parsed_skills", columnDefinition = "LONGTEXT")
    private String parsedSkills;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public JobDescription() {
    }

    public JobDescription(Long id, User user, String title, String companyName, String rawText, String parsedSkills, LocalDateTime createdAt) {
        this.id = id;
        this.user = user;
        this.title = title;
        this.companyName = companyName;
        this.rawText = rawText;
        this.parsedSkills = parsedSkills;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }

    public String getRawText() { return rawText; }
    public void setRawText(String rawText) { this.rawText = rawText; }

    public String getParsedSkills() { return parsedSkills; }
    public void setParsedSkills(String parsedSkills) { this.parsedSkills = parsedSkills; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id;
        private User user;
        private String title;
        private String companyName;
        private String rawText;
        private String parsedSkills;
        private LocalDateTime createdAt;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder user(User user) { this.user = user; return this; }
        public Builder title(String title) { this.title = title; return this; }
        public Builder companyName(String companyName) { this.companyName = companyName; return this; }
        public Builder rawText(String rawText) { this.rawText = rawText; return this; }
        public Builder parsedSkills(String parsedSkills) { this.parsedSkills = parsedSkills; return this; }
        public Builder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public JobDescription build() {
            return new JobDescription(id, user, title, companyName, rawText, parsedSkills, createdAt);
        }
    }
}
