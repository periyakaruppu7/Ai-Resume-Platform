package com.platform.repository;

import com.platform.entity.RagDocument;
import com.platform.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RagDocumentRepository extends JpaRepository<RagDocument, Long> {
    List<RagDocument> findByUserOrderByCreatedAtDesc(User user);
    Optional<RagDocument> findByIdAndUser(Long id, User user);
}
