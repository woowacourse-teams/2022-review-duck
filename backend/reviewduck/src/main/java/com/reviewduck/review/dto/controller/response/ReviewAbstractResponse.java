package com.reviewduck.review.dto.controller.response;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import com.reviewduck.review.domain.Answer;
import com.reviewduck.review.domain.QuestionAnswer;
import com.reviewduck.review.domain.Review;
import com.reviewduck.review.domain.ReviewForm;
import com.reviewduck.review.domain.ReviewFormQuestion;

/*
    DisplayType 선택을 위한 abstract class
 */
public abstract class ReviewAbstractResponse {

    static List<ReviewContentResponse> getSynchronizedReviewContents(Review review) {
        ReviewForm reviewForm = review.getReviewForm();

        Map<ReviewFormQuestion, Answer> reviewMap = review.getQuestionAnswers().stream()
            .collect(Collectors.toUnmodifiableMap(QuestionAnswer::getReviewFormQuestion, QuestionAnswer::getAnswer));

        return reviewForm.getQuestions().stream()
            .map(question -> ReviewContentResponse.of(question, reviewMap.getOrDefault(question, null)))
            .collect(Collectors.toUnmodifiableList());
    }
}
