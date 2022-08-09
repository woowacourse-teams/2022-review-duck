package com.reviewduck.admin.dto.response;

import java.util.List;
import java.util.stream.Collectors;

import com.reviewduck.review.domain.Review;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class AdminReviewResponse {

    private AdminReviewInfoResponse reviewInfo;
    private List<AdminQuestionAnswerResponse> questionAnswers;

    public static AdminReviewResponse from(Review review) {
        AdminReviewInfoResponse reviewInfoResponse = AdminReviewInfoResponse.from(review);
        List<AdminQuestionAnswerResponse> questionAnswerResponses = review.getQuestionAnswers().stream()
            .map(AdminQuestionAnswerResponse::from)
            .collect(Collectors.toUnmodifiableList());

        return new AdminReviewResponse(reviewInfoResponse, questionAnswerResponses);
    }
}
