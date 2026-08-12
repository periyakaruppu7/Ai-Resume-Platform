package com.platform.repository;

import com.platform.entity.InterviewQuestion;
import com.platform.entity.InterviewSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InterviewQuestionRepository extends JpaRepository<InterviewQuestion, Long> {
    List<InterviewQuestion> findBySessionOrderByIdAsc(InterviewSession session);
}
