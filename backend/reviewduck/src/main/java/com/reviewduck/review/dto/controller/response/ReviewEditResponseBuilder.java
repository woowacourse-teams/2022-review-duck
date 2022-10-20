package com.reviewduck.review.dto.controller.response;

import java.util.Arrays;
import java.util.function.Function;

import com.reviewduck.review.domain.Review;
import com.reviewduck.review.domain.ReviewForm;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public enum ReviewEditResponseBuilder {
    SYNC(true, ReviewSynchronizedResponse::from),
    NON_SYNC(false, ReviewNonSynchronizedResponse::from);

    private final boolean isActive;
    private final Function<Review, ReviewEditResponse> responseBuilder;

    public static ReviewEditResponse createResponseFrom(Review review) {
        ReviewForm reviewForm = review.getReviewForm();

        if (reviewForm.isActive()) {
            return SYNC.responseBuilder.apply(review);
        }
        return NON_SYNC.responseBuilder.apply(review);

        // return Arrays.stream(values())
        //     .filter(it -> it.isActive() == reviewForm.isActive())
        //     .findFirst()
        //     .orElse(NON_SYNC)
        //     .getResponseBuilder()
        //     .apply(review);
    }
}
