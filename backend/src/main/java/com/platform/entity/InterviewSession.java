package com.platform.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "interview_sessions")
public class InterviewSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "application_id")
    private Application application;

    @Column(name = "session_title")
    private String sessionTitle;

    @Column(length = 50)
    private String status = "IN_PROGRESS";

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public InterviewSession() {
    }

    public InterviewSession(Long id, User user, Application application, String sessionTitle, String status, LocalDateTime createdAt) {
        this.id = id;
        this.user = user;
        this.application = application;
        this.sessionTitle = sessionTitle;
        this.status = status != null ? status : "IN_PROGRESS";
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Application getApplication() { return application; }
    public void setApplication(Application application) { this.application = application; }

    public String getSessionTitle() { return sessionTitle; }
    public void setSessionTitle(String sessionTitle) { this.sessionTitle = sessionTitle; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id;
        private User user;
        private Application application;
        private String sessionTitle;
        private String status = "IN_PROGRESS";
        private LocalDateTime createdAt;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder user(User user) { this.user = user; return this; }
        public Builder application(Application application) { this.application = application; return this; }
        public Builder sessionTitle(String sessionTitle) { this.sessionTitle = sessionTitle; return this; }
        public Builder status(String status) { this.status = status; return this; }
        public Builder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public InterviewSession build() {
            return new InterviewSession(id, user, application, sessionTitle, status, createdAt);
        }
    }
}
