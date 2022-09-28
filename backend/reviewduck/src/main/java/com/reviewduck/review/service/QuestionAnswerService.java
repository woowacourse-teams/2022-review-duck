package com.reviewduck.review.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.reviewduck.review.domain.Answer;
import com.reviewduck.review.domain.QuestionAnswer;
import com.reviewduck.review.domain.ReviewFormQuestion;
import com.reviewduck.review.repository.QuestionAnswerRepository;

import lombok.AllArgsConstructor;

@Service
@Transactional(readOnly = true)
@AllArgsConstructor
public class QuestionAnswerService {

    private final QuestionAnswerRepository questionAnswerRepository;

    @Transactional
    public QuestionAnswer getOrSave(ReviewFormQuestion question, Answer answer) {
        return questionAnswerRepository.findByAnswerId(answer.getId())
            .orElseGet(() -> new QuestionAnswer(question, answer));
    }

}
