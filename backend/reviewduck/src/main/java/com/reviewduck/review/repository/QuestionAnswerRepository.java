package com.reviewduck.review.repository;

import java.util.Optional;

import org.springframework.data.repository.Repository;

import com.reviewduck.review.domain.QuestionAnswer;

public interface QuestionAnswerRepository extends Repository<QuestionAnswer, Long> {

    Optional<QuestionAnswer> findByAnswerId(Long answerId);
}
