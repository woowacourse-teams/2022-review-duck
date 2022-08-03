package com.reviewduck.review.dto.response;

import com.reviewduck.review.domain.ReviewForm;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class MyReviewReviewFormResponse {

    private String title;
    private String code;
    private CreatorResponse creator;

    public static MyReviewReviewFormResponse from(ReviewForm reviewForm) {
        CreatorResponse creator = CreatorResponse.from(reviewForm.getMember());
        return new MyReviewReviewFormResponse(reviewForm.getReviewTitle(), reviewForm.getCode(), creator);
    }
}
