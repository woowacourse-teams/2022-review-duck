package com.reviewduck.review.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.reviewduck.common.exception.NotFoundException;
import com.reviewduck.review.domain.Answer;
import com.reviewduck.review.repository.AnswerRepository;

import lombok.AllArgsConstructor;

@Service
@Transactional(readOnly = true)
@AllArgsConstructor
public class AnswerService {

    private final AnswerRepository answerRepository;

    public Answer findById(long answerId) {
        return answerRepository.findById(answerId)
            .orElseThrow(() -> new NotFoundException("존재하지 않는 답변입니다."));
    }

    public Answer saveNewAnswer() {
        return answerRepository.save(new Answer(""));
    }
}
