package com.reviewduck.review.service;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class ReviewFormQuestionUpdateDto {

    private final Long id;
    private final String value;
    private final String description;
}
