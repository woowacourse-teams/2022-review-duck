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

    private int numberOfReviews;
    private boolean isMine;
    private List<ReviewSummaryResponse> reviews;

    public static ReviewsResponse of(List<Review> reviews, String socialId, Member member) {
        List<ReviewSummaryResponse> reviewResponses = reviews.stream()
            .map(ReviewSummaryResponse::from)
            .collect(Collectors.toUnmodifiableList());

        boolean isMine = member.getSocialId().equals(socialId);

        return new ReviewsResponse(reviews.size(), isMine, reviewResponses);
    }

    public boolean getIsMine() {
        return isMine;
    }
}
