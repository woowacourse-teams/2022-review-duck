package com.reviewduck.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.reviewduck.domain.Answer;

public interface AnswerRepository extends JpaRepository<Answer, Long> {
}
