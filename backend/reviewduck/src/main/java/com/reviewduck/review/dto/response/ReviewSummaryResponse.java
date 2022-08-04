package com.reviewduck.review.dto.response;

import java.util.List;
import java.util.stream.Collectors;

import com.reviewduck.review.domain.Review;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class ReviewSummaryResponse {

    private List<QuestionAnswerResponse> answers;

    public static ReviewSummaryResponse from(Review review) {
        List<QuestionAnswerResponse> answers = review.getQuestionAnswers().stream()
            .map(QuestionAnswerResponse::from)
            .collect(Collectors.toUnmodifiableList());

        return new ReviewSummaryResponse(answers);
    }
}
