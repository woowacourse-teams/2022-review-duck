package com.reviewduck.review.dto.response;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import com.reviewduck.review.domain.Answer;
import com.reviewduck.review.domain.QuestionAnswer;
import com.reviewduck.review.domain.Review;
import com.reviewduck.review.domain.ReviewForm;
import com.reviewduck.review.domain.ReviewFormQuestion;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@AllArgsConstructor(access = AccessLevel.PRIVATE)
@NoArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class ReviewSummaryResponse {

    private List<QuestionAnswerResponse> answers;

    public static ReviewSummaryResponse from(Review review) {
        List<QuestionAnswerResponse> answers = review.getQuestionAnswers().stream()
            .map(QuestionAnswerResponse::from)
            .collect(Collectors.toUnmodifiableList());

        return new ReviewSummaryResponse(answers);
    }

    public static ReviewSummaryResponse synchronizedWithReviewForm(Review review) {
        ReviewForm reviewForm = review.getReviewForm();

        Map<ReviewFormQuestion, Answer> reviewMap = review.getQuestionAnswers().stream()
            .collect(Collectors.toUnmodifiableMap(QuestionAnswer::getReviewFormQuestion, QuestionAnswer::getAnswer));

        List<QuestionAnswerResponse> answers = reviewForm.getReviewFormQuestions().stream()
            .map(question -> QuestionAnswerResponse.of(question, reviewMap.getOrDefault(question, null)))
            .collect(Collectors.toUnmodifiableList());

        return new ReviewSummaryResponse(answers);
    }
}
