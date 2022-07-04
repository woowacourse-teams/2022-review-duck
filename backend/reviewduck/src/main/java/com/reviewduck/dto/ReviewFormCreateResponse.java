package com.reviewduck.dto;

import com.reviewduck.domain.ReviewForm;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class ReviewFormCreateResponse {

    private final String reviewFormCode;

    public static ReviewFormCreateResponse from(ReviewForm reviewForm) {
        return new ReviewFormCreateResponse(reviewForm.getCode());
    }
}
