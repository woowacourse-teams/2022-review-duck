package com.reviewduck.dto.response;

import java.sql.Timestamp;
import java.util.List;
import java.util.stream.Collectors;

import com.reviewduck.domain.ReviewForm;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class ReviewFormResponse {

    private String reviewTitle;
    private long updatedAt;
    private List<QuestionResponse> questions;

    public static ReviewFormResponse from(ReviewForm reviewForm) {
        List<QuestionResponse> questionResponses = reviewForm.getQuestions().stream()
            .map(QuestionResponse::from)
            .collect(Collectors.toUnmodifiableList());

        return new ReviewFormResponse(reviewForm.getReviewTitle()
            , Timestamp.valueOf(reviewForm.getUpdatedAt()).getTime()
            , questionResponses);
    }
}
