package com.reviewduck.review.dto.response;

import java.util.List;
import java.util.stream.Collectors;

import com.reviewduck.member.domain.Member;
import com.reviewduck.review.domain.Review;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class ReviewsResponse {

    private List<ReviewResponse> reviews;

    public static ReviewsResponse of(Member member, List<Review> reviews) {
        List<ReviewResponse> reviewResponses = reviews.stream()
            .map(review -> ReviewResponse.of(member, review))
            .collect(Collectors.toUnmodifiableList());

        return new ReviewsResponse(reviewResponses);
    }
}
