package com.reviewduck.review.dto.controller.response;

import java.sql.Timestamp;
import java.util.List;
import java.util.stream.Collectors;

import com.reviewduck.review.domain.ReviewForm;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class MemberReviewFormResponse {

    private String title;
    private String code;
    private long updatedAt;
    private List<ReviewFormQuestionResponse> questions;

    public static MemberReviewFormResponse from(ReviewForm reviewForm) {
        List<ReviewFormQuestionResponse> reviewFormQuestionResponses = reviewForm.getQuestions().stream()
            .map(ReviewFormQuestionResponse::from)
            .collect(Collectors.toUnmodifiableList());

        long updatedAt = Timestamp.valueOf(reviewForm.getUpdatedAt()).getTime();

        return new MemberReviewFormResponse(reviewForm.getTitle(), reviewForm.getCode(), updatedAt,
            reviewFormQuestionResponses);
    }
}
