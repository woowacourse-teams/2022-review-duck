package com.reviewduck.admin.dto.response;

import java.util.List;
import java.util.stream.Collectors;

import com.reviewduck.review.domain.ReviewForm;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class AdminReviewFormsResponse {

    private List<AdminReviewFormInfoResponse> reviewForms;

    public static AdminReviewFormsResponse from(List<ReviewForm> reviewForms) {
        List<AdminReviewFormInfoResponse> reviewFormResponses = reviewForms.stream()
            .map(AdminReviewFormInfoResponse::from)
            .collect(Collectors.toUnmodifiableList());

        return new AdminReviewFormsResponse(reviewFormResponses);
    }
}
