package com.reviewduck.review.dto.response;

import java.util.List;

import com.reviewduck.review.domain.Review;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@AllArgsConstructor(access = AccessLevel.PRIVATE)
@NoArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class ReviewSynchronizedResponse extends ReviewAbstractResponse {

    private String reviewTitle;
    private boolean isPrivate;
    private List<ReviewContentResponse> contents;

    public static ReviewSynchronizedResponse from(Review review) {
        List<ReviewContentResponse> contents = getReviewContents(review);

        return new ReviewSynchronizedResponse(review.getTitle(), review.isPrivate(), contents);
    }

    public boolean getIsPrivate() {
        return isPrivate;
    }
}
