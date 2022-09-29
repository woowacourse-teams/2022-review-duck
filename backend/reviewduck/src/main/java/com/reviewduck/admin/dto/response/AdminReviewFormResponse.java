package com.reviewduck.admin.dto.response;

import java.util.List;
import java.util.stream.Collectors;

import com.reviewduck.review.domain.Review;
import com.reviewduck.review.domain.ReviewForm;
import com.reviewduck.review.dto.controller.response.ReviewFormQuestionResponse;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class AdminReviewFormResponse {

    private AdminReviewFormInfoResponse reviewFormInfo;
    private List<ReviewFormQuestionResponse> questions;
    private List<AdminReviewInfoResponse> reviews;

    public static AdminReviewFormResponse of(ReviewForm reviewForm, List<Review> reviews) {
        AdminReviewFormInfoResponse reviewFormInfoResponse = AdminReviewFormInfoResponse.from(reviewForm);

        List<ReviewFormQuestionResponse> questionResponses = reviewForm.getReviewFormQuestions().stream()
            .map(ReviewFormQuestionResponse::from)
            .collect(Collectors.toUnmodifiableList());

        List<AdminReviewInfoResponse> reviewResponses = reviews.stream()
            .map(AdminReviewInfoResponse::from)
            .collect(Collectors.toUnmodifiableList());

        return new AdminReviewFormResponse(reviewFormInfoResponse, questionResponses, reviewResponses);
    }
}
