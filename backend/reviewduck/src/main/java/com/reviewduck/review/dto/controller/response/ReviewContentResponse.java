package com.reviewduck.review.dto.controller.response;

import com.reviewduck.review.domain.Answer;
import com.reviewduck.review.domain.QuestionAnswer;
import com.reviewduck.review.domain.ReviewFormQuestion;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class ReviewContentResponse {

    private ReviewFormQuestionResponse question;
    private AnswerResponse answer;

    public static ReviewContentResponse from(QuestionAnswer questionAnswer) {
        return new ReviewContentResponse(
            ReviewFormQuestionResponse.from(questionAnswer.getReviewFormQuestion()),
            AnswerResponse.from(questionAnswer.getAnswer())
        );
    }

    public static ReviewContentResponse of(ReviewFormQuestion question, Answer answer) {
        if (answer == null) {
            return new ReviewContentResponse(ReviewFormQuestionResponse.from(question), null);
        }
        return new ReviewContentResponse(ReviewFormQuestionResponse.from(question), AnswerResponse.from(answer));
    }
}
