package com.reviewduck.review.service;

import org.springframework.cache.annotation.Cacheable;
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

    public ReviewFormQuestion findById(long questionId) {
        return reviewFormQuestionRepository.findById(questionId)
            .orElseThrow(() -> new NotFoundException("존재하지 않는 질문입니다."));
    }
}
