package com.reviewduck.dto.response;

import com.reviewduck.domain.ReviewForm;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class ReviewFormCreateResponse {

    private String reviewFormCode;

    public static ReviewFormCreateResponse from(ReviewForm reviewForm) {
        return new ReviewFormCreateResponse(reviewForm.getCode());
    }
}
