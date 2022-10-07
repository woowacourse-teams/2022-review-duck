package com.reviewduck.review.dto.controller.response;

import java.util.List;
import java.util.stream.Collectors;

import com.reviewduck.review.domain.Review;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@AllArgsConstructor(access = AccessLevel.PRIVATE)
@NoArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class ReviewNonSynchronizedResponse extends ReviewEditResponse {

    private String reviewTitle;
    private boolean isPrivate;
    private List<ReviewContentResponse> contents;

    public static ReviewNonSynchronizedResponse from(Review review) {

        List<ReviewContentResponse> contents = review.getQuestionAnswers().stream()
            .map(ReviewContentResponse::from)
            .collect(Collectors.toUnmodifiableList());

        return new ReviewNonSynchronizedResponse(review.getTitle(), review.isPrivate(), contents);
    }

    public boolean getIsPrivate() {
        return isPrivate;
    }
}
