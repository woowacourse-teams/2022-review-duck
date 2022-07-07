package com.reviewduck.dto.response;

import java.util.List;
import java.util.stream.Collectors;

import com.reviewduck.domain.Review;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class ReviewsFindResponse {

    private String reviewFormTitle;
    private List<ReviewResponse> reviews;

    public static ReviewsFindResponse of(String reviewTitle, List<Review> reviews) {
        List<ReviewResponse> reviewResponses = reviews.stream()
            .map(ReviewResponse::from)
            .collect(Collectors.toUnmodifiableList());

        return new ReviewsFindResponse(reviewTitle, reviewResponses);
    }
}
