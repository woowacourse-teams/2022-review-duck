package com.reviewduck.review.repository;

import java.util.Optional;

import org.springframework.data.repository.Repository;

import com.reviewduck.review.domain.ReviewFormQuestion;

public interface ReviewFormQuestionRepository extends Repository<ReviewFormQuestion, Long> {

    Optional<ReviewFormQuestion> findById(long questionId);
}
