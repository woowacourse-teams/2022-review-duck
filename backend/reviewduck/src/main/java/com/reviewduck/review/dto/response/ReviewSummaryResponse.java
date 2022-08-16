package com.reviewduck.review.dto.response;

import java.sql.Timestamp;
import java.util.List;
import java.util.stream.Collectors;

import com.reviewduck.review.domain.Review;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class ReviewSummaryResponse {

    private Long id;
    private String title;
    private long updatedAt;
    private List<ReviewContentResponse> contents;
    private ReviewFormSummaryResponse reviewForm;

    public static ReviewSummaryResponse from(Review review) {
        List<ReviewContentResponse> contents = review.getQuestionAnswers().stream()
            .map(ReviewContentResponse::from)
            .collect(Collectors.toUnmodifiableList());

        return new ReviewSummaryResponse(
            review.getId(),
            review.getTitle(),
            Timestamp.valueOf(review.getUpdatedAt()).getTime(),
            contents,
            ReviewFormSummaryResponse.from(review.getReviewForm())
        );
    }
}
