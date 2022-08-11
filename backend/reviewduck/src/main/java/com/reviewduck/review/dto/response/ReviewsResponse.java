package com.reviewduck.review.dto.response;

import java.util.List;
import java.util.stream.Collectors;

import com.reviewduck.review.domain.Review;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class ReviewsResponse {

    private int numberOfReviews;
    private List<ReviewSummaryResponse> reviews;

    public static ReviewsResponse from(List<Review> reviews) {
        List<ReviewSummaryResponse> reviewResponses = reviews.stream()
            .map(ReviewSummaryResponse::from)
            .collect(Collectors.toUnmodifiableList());

        return new ReviewsResponse(reviews.size(), reviewResponses);
    }
}
