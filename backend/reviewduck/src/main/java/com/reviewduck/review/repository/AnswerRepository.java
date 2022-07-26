package com.reviewduck.review.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.reviewduck.review.domain.Answer;

public interface AnswerRepository extends JpaRepository<Answer, Long> {
}
