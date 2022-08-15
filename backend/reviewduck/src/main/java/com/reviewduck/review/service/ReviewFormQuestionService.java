package com.reviewduck.review.service;

import java.util.Objects;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.reviewduck.common.exception.NotFoundException;
import com.reviewduck.review.domain.ReviewFormQuestion;
import com.reviewduck.review.repository.ReviewFormQuestionRepository;

import lombok.AllArgsConstructor;

@Service
@Transactional(readOnly = true)
@AllArgsConstructor
public class ReviewFormQuestionService {

    private final ReviewFormQuestionRepository reviewFormQuestionRepository;

    @Transactional
    public ReviewFormQuestion save(String value, String description) {
        return reviewFormQuestionRepository.save(new ReviewFormQuestion(value, description));
    }

    @Transactional
    public ReviewFormQuestion saveOrUpdateQuestion(Long questionId, String value, String description) {
        if (Objects.isNull(questionId)) {
            return reviewFormQuestionRepository.save(new ReviewFormQuestion(value, description));
        }

        ReviewFormQuestion reviewFormQuestion = findById(questionId);
        reviewFormQuestion.update(value, description);

        return reviewFormQuestion;
    }

    public ReviewFormQuestion findById(long questionId) {
        return reviewFormQuestionRepository.findById(questionId)
            .orElseThrow(() -> new NotFoundException("존재하지 않는 질문입니다."));
    }
}
