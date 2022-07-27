package com.reviewduck.review.dto.response;

import java.sql.Timestamp;
import java.util.List;
import java.util.stream.Collectors;

import com.reviewduck.review.domain.Review;
import com.reviewduck.review.domain.ReviewForm;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class ReviewsFindResponse {

    private String reviewFormTitle;
    private long updatedAt;
    private List<ReviewResponse> reviews;

    public static ReviewsFindResponse of(ReviewForm reviewForm, List<Review> reviews) {
        List<ReviewResponse> reviewResponses = reviews.stream()
            .map(ReviewResponse::from)
            .collect(Collectors.toUnmodifiableList());

        return new ReviewsFindResponse(reviewForm.getReviewTitle(),
            Timestamp.valueOf(reviewForm.getUpdatedAt()).getTime(),
            reviewResponses);
    }
}
