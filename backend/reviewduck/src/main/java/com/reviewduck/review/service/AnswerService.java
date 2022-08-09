package com.reviewduck.review.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.reviewduck.review.domain.Answer;
import com.reviewduck.review.repository.AnswerRepository;

import lombok.AllArgsConstructor;

@Service
@Transactional(readOnly = true)
@AllArgsConstructor
public class AnswerService {

    private final AnswerRepository answerRepository;

    public Answer saveNewAnswer() {
        return answerRepository.save(new Answer(""));
    }
}
