package com.platform.repository;

import com.platform.entity.InterviewSession;
import com.platform.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InterviewSessionRepository extends JpaRepository<InterviewSession, Long> {
    List<InterviewSession> findByUserOrderByCreatedAtDesc(User user);
    Optional<InterviewSession> findByIdAndUser(Long id, User user);
}
