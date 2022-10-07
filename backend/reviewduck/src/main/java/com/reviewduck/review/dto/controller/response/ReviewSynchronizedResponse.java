package com.reviewduck.review.dto.controller.response;

import java.util.List;
import java.util.stream.Collectors;

import com.reviewduck.review.domain.Review;
import com.reviewduck.review.domain.ReviewForm;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@AllArgsConstructor(access = AccessLevel.PRIVATE)
@NoArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class ReviewSynchronizedResponse extends ReviewEditResponse {

    private String reviewTitle;
    private boolean isPrivate;
    private List<ReviewContentResponse> contents;

    public static ReviewSynchronizedResponse from(Review review) {

        List<ReviewContentResponse> contents = getSynchronizedReviewContents(review);

        return new ReviewSynchronizedResponse(review.getTitle(), review.isPrivate(), contents);
    }

    public boolean getIsPrivate() {
        return isPrivate;
    }
}
