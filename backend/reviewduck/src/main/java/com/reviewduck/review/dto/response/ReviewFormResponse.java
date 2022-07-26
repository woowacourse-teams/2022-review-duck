package com.reviewduck.review.dto.response;

import java.sql.Timestamp;
import java.util.List;
import java.util.stream.Collectors;

import com.reviewduck.review.domain.ReviewForm;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class ReviewFormResponse {

    private String reviewTitle;
    private long updatedAt;
    private List<ReviewFormQuestionResponse> questions;

    public static ReviewFormResponse from(ReviewForm reviewForm) {
        List<ReviewFormQuestionResponse> reviewFormQuestionRespons = reviewForm.getReviewFormQuestions().stream()
            .map(ReviewFormQuestionResponse::from)
            .collect(Collectors.toUnmodifiableList());

        return new ReviewFormResponse(reviewForm.getReviewTitle()
            , Timestamp.valueOf(reviewForm.getUpdatedAt()).getTime()
            , reviewFormQuestionRespons);
    }
}
