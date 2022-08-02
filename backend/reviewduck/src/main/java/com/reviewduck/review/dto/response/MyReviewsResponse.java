package com.reviewduck.review.dto.response;

import java.util.List;
import java.util.stream.Collectors;

import com.reviewduck.review.domain.Review;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class MyReviewsResponse {
    private int numberOfReviews;
    private List<MyReviewResponse> reviews;

    public static MyReviewsResponse from(List<Review> reviews) {
        List<MyReviewResponse> reviewResponses = reviews.stream()
            .map(MyReviewResponse::of)
            .collect(Collectors.toList());
        return new MyReviewsResponse(reviews.size(), reviewResponses);
    }
}
