package com.reviewduck.review.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.reviewduck.review.domain.ReviewFormQuestion;

public interface ReviewFormQuestionRepository extends JpaRepository<ReviewFormQuestion, Long> {
}
