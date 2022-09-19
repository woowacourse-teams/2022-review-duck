package com.reviewduck.review.dto.response;

import java.util.List;

import org.springframework.data.domain.Page;

import com.reviewduck.member.domain.Member;
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
    private List<ReviewAbstractResponse> reviews;

    public static ReviewsOfReviewFormResponse of(Member member, Page<Review> reviews, String displayType) {
        List<ReviewAbstractResponse> reviewResponses = ReviewDisplayBuilder.of(displayType)
            .createResponseFrom(member, reviews.getContent());

        return new ReviewsOfReviewFormResponse(reviews.getTotalElements(), reviewResponses);
    }

}
