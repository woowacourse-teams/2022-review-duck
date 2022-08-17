package com.reviewduck.admin.dto.response;

import java.util.List;
import java.util.stream.Collectors;

import com.reviewduck.review.domain.Review;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class AdminReviewsByReviewFormResponse {

    private List<AdminReviewInfoResponse> reviews;

    public static AdminReviewsByReviewFormResponse from(List<Review> reviews) {
        List<AdminReviewInfoResponse> reviewResponses = reviews.stream()
            .map(AdminReviewInfoResponse::from)
            .collect(Collectors.toUnmodifiableList());

        return new AdminReviewsByReviewFormResponse(reviewResponses);
    }
}
