package com.reviewduck.review.service;

import java.util.Objects;

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

    public Answer findOrCreateAnswer(Long id) {
        if (Objects.isNull(id)) {
            return answerRepository.save(new Answer(""));
        }

        return answerRepository.findById(id)
            .orElseThrow(() -> new NotFoundException("존재하지 않는 답변 번호입니다."));
    }

}
