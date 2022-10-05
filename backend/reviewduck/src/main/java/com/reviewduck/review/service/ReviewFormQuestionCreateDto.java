package com.reviewduck.review.service;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class ReviewFormQuestionCreateDto {

    private final String value;
    private final String description;
}
