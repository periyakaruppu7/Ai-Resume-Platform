package com.platform.repository;

import com.platform.entity.Application;
import com.platform.entity.JobDescription;
import com.platform.entity.Resume;
import com.platform.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findByUserOrderByCreatedAtDesc(User user);
    Optional<Application> findByIdAndUser(Long id, User user);
    Optional<Application> findByResumeAndJobDescription(Resume resume, JobDescription jobDescription);
}
