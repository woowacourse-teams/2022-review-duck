package com.reviewduck.admin.dto.response;

import java.util.List;
import java.util.stream.Collectors;

import com.reviewduck.review.domain.Review;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class AdminReviewsResponse {
    private List<AdminReviewResponse> reviews;

    public static AdminReviewsResponse from(List<Review> reviews) {
        List<AdminReviewResponse> reviewResponses = reviews.stream()
            .map(AdminReviewResponse::from)
            .collect(Collectors.toList());

        return new AdminReviewsResponse(reviewResponses);
    }
}
