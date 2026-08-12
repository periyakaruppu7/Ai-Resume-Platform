package com.platform.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "interview_questions")
public class InterviewQuestion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "session_id", nullable = false)
    private InterviewSession session;

    @Column(name = "question_text", nullable = false, columnDefinition = "TEXT")
    private String questionText;

    @Column(name = "target_skill")
    private String targetSkill;

    @Column(length = 50)
    private String difficulty;

    @Column(name = "user_answer", columnDefinition = "TEXT")
    private String userAnswer;

    @Column(name = "correctness_score")
    private Integer correctnessScore;

    @Column(name = "clarity_score")
    private Integer clarityScore;

    @Lob
    @Column(name = "missing_concepts", columnDefinition = "LONGTEXT")
    private String missingConcepts;

    @Column(name = "ideal_response", columnDefinition = "TEXT")
    private String idealResponse;

    @Column(columnDefinition = "TEXT")
    private String feedback;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public InterviewQuestion() {
    }

    public InterviewQuestion(Long id, InterviewSession session, String questionText, String targetSkill, String difficulty, String userAnswer, Integer correctnessScore, Integer clarityScore, String missingConcepts, String idealResponse, String feedback, LocalDateTime createdAt) {
        this.id = id;
        this.session = session;
        this.questionText = questionText;
        this.targetSkill = targetSkill;
        this.difficulty = difficulty;
        this.userAnswer = userAnswer;
        this.correctnessScore = correctnessScore;
        this.clarityScore = clarityScore;
        this.missingConcepts = missingConcepts;
        this.idealResponse = idealResponse;
        this.feedback = feedback;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public InterviewSession getSession() { return session; }
    public void setSession(InterviewSession session) { this.session = session; }

    public String getQuestionText() { return questionText; }
    public void setQuestionText(String questionText) { this.questionText = questionText; }

    public String getTargetSkill() { return targetSkill; }
    public void setTargetSkill(String targetSkill) { this.targetSkill = targetSkill; }

    public String getDifficulty() { return difficulty; }
    public void setDifficulty(String difficulty) { this.difficulty = difficulty; }

    public String getUserAnswer() { return userAnswer; }
    public void setUserAnswer(String userAnswer) { this.userAnswer = userAnswer; }

    public Integer getCorrectnessScore() { return correctnessScore; }
    public void setCorrectnessScore(Integer correctnessScore) { this.correctnessScore = correctnessScore; }

    public Integer getClarityScore() { return clarityScore; }
    public void setClarityScore(Integer clarityScore) { this.clarityScore = clarityScore; }

    public String getMissingConcepts() { return missingConcepts; }
    public void setMissingConcepts(String missingConcepts) { this.missingConcepts = missingConcepts; }

    public String getIdealResponse() { return idealResponse; }
    public void setIdealResponse(String idealResponse) { this.idealResponse = idealResponse; }

    public String getFeedback() { return feedback; }
    public void setFeedback(String feedback) { this.feedback = feedback; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id;
        private InterviewSession session;
        private String questionText;
        private String targetSkill;
        private String difficulty;
        private String userAnswer;
        private Integer correctnessScore;
        private Integer clarityScore;
        private String missingConcepts;
        private String idealResponse;
        private String feedback;
        private LocalDateTime createdAt;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder session(InterviewSession session) { this.session = session; return this; }
        public Builder questionText(String questionText) { this.questionText = questionText; return this; }
        public Builder targetSkill(String targetSkill) { this.targetSkill = targetSkill; return this; }
        public Builder difficulty(String difficulty) { this.difficulty = difficulty; return this; }
        public Builder userAnswer(String userAnswer) { this.userAnswer = userAnswer; return this; }
        public Builder correctnessScore(Integer correctnessScore) { this.correctnessScore = correctnessScore; return this; }
        public Builder clarityScore(Integer clarityScore) { this.clarityScore = clarityScore; return this; }
        public Builder missingConcepts(String missingConcepts) { this.missingConcepts = missingConcepts; return this; }
        public Builder idealResponse(String idealResponse) { this.idealResponse = idealResponse; return this; }
        public Builder feedback(String feedback) { this.feedback = feedback; return this; }
        public Builder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public InterviewQuestion build() {
            return new InterviewQuestion(id, session, questionText, targetSkill, difficulty, userAnswer, correctnessScore, clarityScore, missingConcepts, idealResponse, feedback, createdAt);
        }
    }
}
