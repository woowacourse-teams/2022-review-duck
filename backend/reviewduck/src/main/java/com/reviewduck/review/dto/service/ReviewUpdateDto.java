package com.reviewduck.review.dto.service;

import com.reviewduck.review.domain.ReviewFormQuestion;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ReviewUpdateDto {

    private final ReviewFormQuestion reviewFormQuestion;
    private final String answerValue;
}
