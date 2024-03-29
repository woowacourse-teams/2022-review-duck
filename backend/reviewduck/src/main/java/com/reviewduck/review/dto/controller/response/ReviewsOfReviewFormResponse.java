package com.reviewduck.review.dto.controller.response;

import java.util.List;

import org.springframework.data.domain.Page;

import com.reviewduck.review.domain.Review;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class ReviewsOfReviewFormResponse {

    private long numberOfReviews;
    private boolean isLastPage;
    private List<ReviewAbstractResponse> reviews;

    public static ReviewsOfReviewFormResponse of(long memberId, Page<Review> reviews, String displayType) {
        List<ReviewAbstractResponse> reviewResponses = ReviewDisplayBuilder.of(displayType)
            .createResponseFrom(memberId, reviews.getContent());

        return new ReviewsOfReviewFormResponse(reviews.getTotalElements(), reviews.isLast(), reviewResponses);
    }

    public boolean getIsLastPage() {
        return isLastPage;
    }
}
