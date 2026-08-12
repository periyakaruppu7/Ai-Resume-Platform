package com.platform.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "rag_documents")
public class RagDocument {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "document_name", nullable = false)
    private String documentName;

    @Column(name = "file_type", length = 50)
    private String fileType;

    @Column(name = "chunk_count")
    private Integer chunkCount = 0;

    @Column(length = 50)
    private String status = "EMBEDDED";

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public RagDocument() {
    }

    public RagDocument(Long id, User user, String documentName, String fileType, Integer chunkCount, String status, LocalDateTime createdAt) {
        this.id = id;
        this.user = user;
        this.documentName = documentName;
        this.fileType = fileType;
        this.chunkCount = chunkCount != null ? chunkCount : 0;
        this.status = status != null ? status : "EMBEDDED";
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getDocumentName() { return documentName; }
    public void setDocumentName(String documentName) { this.documentName = documentName; }

    public String getFileType() { return fileType; }
    public void setFileType(String fileType) { this.fileType = fileType; }

    public Integer getChunkCount() { return chunkCount; }
    public void setChunkCount(Integer chunkCount) { this.chunkCount = chunkCount; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id;
        private User user;
        private String documentName;
        private String fileType;
        private Integer chunkCount = 0;
        private String status = "EMBEDDED";
        private LocalDateTime createdAt;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder user(User user) { this.user = user; return this; }
        public Builder documentName(String documentName) { this.documentName = documentName; return this; }
        public Builder fileType(String fileType) { this.fileType = fileType; return this; }
        public Builder chunkCount(Integer chunkCount) { this.chunkCount = chunkCount; return this; }
        public Builder status(String status) { this.status = status; return this; }
        public Builder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public RagDocument build() {
            return new RagDocument(id, user, documentName, fileType, chunkCount, status, createdAt);
        }
    }
}
