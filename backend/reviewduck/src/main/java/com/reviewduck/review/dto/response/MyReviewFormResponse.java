package com.reviewduck.review.dto.response;

import java.sql.Timestamp;
import java.util.List;
import java.util.stream.Collectors;

import com.reviewduck.review.domain.ReviewForm;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class MyReviewFormResponse {
    private String title;
    private String code;
    private long updatedAt;
    private List<ReviewFormQuestionResponse> questions;

    public static MyReviewFormResponse from(ReviewForm reviewForm) {
        List<ReviewFormQuestionResponse> reviewFormQuestionResponses = reviewForm.getReviewFormQuestions().stream()
            .map(ReviewFormQuestionResponse::from)
            .collect(Collectors.toUnmodifiableList());

        long updatedAt = Timestamp.valueOf(reviewForm.getUpdatedAt()).getTime();

        return new MyReviewFormResponse(reviewForm.getReviewTitle(), reviewForm.getCode(), updatedAt,
            reviewFormQuestionResponses);
    }
}
