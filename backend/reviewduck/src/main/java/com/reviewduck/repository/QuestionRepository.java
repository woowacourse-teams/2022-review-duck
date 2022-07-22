package com.reviewduck.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.reviewduck.domain.ReviewFormQuestion;

public interface QuestionRepository extends JpaRepository<ReviewFormQuestion, Long> {
}
