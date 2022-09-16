package com.reviewduck.review.repository;

import java.util.Optional;

import org.springframework.data.repository.Repository;

import com.reviewduck.review.domain.Answer;

public interface AnswerRepository extends Repository<Answer, Long> {

    Answer save(Answer answer);

    Optional<Answer> findById(Long id);
}
