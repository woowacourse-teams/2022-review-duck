package com.reviewduck.review.dto.service;

import com.reviewduck.review.domain.Answer;
import com.reviewduck.review.domain.ReviewFormQuestion;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ReviewCreateDto {

    private final ReviewFormQuestion reviewFormQuestion;
    private final Answer answer;
}
