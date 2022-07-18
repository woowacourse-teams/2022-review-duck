package com.reviewduck.dto.response;

import com.reviewduck.domain.ReviewForm;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class ReviewFormCodeResponse {

    private String reviewFormCode;

    public static ReviewFormCodeResponse from(ReviewForm reviewForm) {
        return new ReviewFormCodeResponse(reviewForm.getCode());
    }
}
