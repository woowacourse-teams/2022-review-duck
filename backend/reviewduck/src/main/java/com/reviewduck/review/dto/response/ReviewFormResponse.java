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
    private MemberResponse creator;
    private boolean isCreator;
    private List<ReviewFormQuestionResponse> questions;

    public static ReviewFormResponse of(ReviewForm reviewForm, boolean isCreator) {
        List<ReviewFormQuestionResponse> reviewFormQuestionRespons = reviewForm.getReviewFormQuestions().stream()
            .map(ReviewFormQuestionResponse::from)
            .collect(Collectors.toUnmodifiableList());

        return new ReviewFormResponse(
            reviewForm.getReviewTitle(),
            Timestamp.valueOf(reviewForm.getUpdatedAt()).getTime(),
            MemberResponse.from(reviewForm.getMember()),
            isCreator,
            reviewFormQuestionRespons
        );
    }

    public boolean getIsCreator() {
        return isCreator;
    }
}
