package com.reviewduck.review.dto.service;

import com.reviewduck.review.domain.ReviewFormQuestion;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class QuestionAnswerUpdateDto {

    private final ReviewFormQuestion reviewFormQuestion;
    private final String answerValue;
}
