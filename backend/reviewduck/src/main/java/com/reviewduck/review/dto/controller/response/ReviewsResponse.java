package com.reviewduck.review.dto.controller.response;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;

import com.reviewduck.review.domain.Review;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class ReviewsResponse {

    private long numberOfReviews;
    private boolean isMine;
    private boolean isLastPage;
    private List<ReviewSummaryResponse> reviews;

    public static ReviewsResponse of(Page<Review> reviews, boolean isMine) {
        List<ReviewSummaryResponse> reviewResponses = reviews.getContent().stream()
            .map(ReviewSummaryResponse::from)
            .collect(Collectors.toUnmodifiableList());

        return new ReviewsResponse(reviews.getTotalElements(), isMine, reviews.isLast(), reviewResponses);
    }

    public boolean getIsMine() {
        return isMine;
    }

    public boolean getIsLastPage() {
        return isLastPage;
    }

}
