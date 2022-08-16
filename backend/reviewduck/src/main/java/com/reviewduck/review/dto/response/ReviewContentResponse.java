package com.reviewduck.review.dto.response;

import java.util.Objects;

import com.reviewduck.review.domain.Answer;
import com.reviewduck.review.domain.QuestionAnswer;
import com.reviewduck.review.domain.ReviewFormQuestion;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class ReviewContentResponse {

    private QuestionResponse question;
    private AnswerResponse answer;

    public static ReviewContentResponse from(QuestionAnswer questionAnswer) {
        return new ReviewContentResponse(
            QuestionResponse.from(questionAnswer.getReviewFormQuestion()),
            AnswerResponse.from(questionAnswer.getAnswer())
        );
    }

    public static ReviewContentResponse of(ReviewFormQuestion question, Answer answer) {
        if (Objects.isNull(answer)) {
            return new ReviewContentResponse(QuestionResponse.from(question), null);
        }
        return new ReviewContentResponse(QuestionResponse.from(question), AnswerResponse.from(answer));
    }
}
