package com.reviewduck.review.dto.response;

import com.reviewduck.review.domain.Answer;
import com.reviewduck.review.domain.QuestionAnswer;
import com.reviewduck.review.domain.ReviewFormQuestion;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class QuestionAnswerResponse {

    private String questionValue;
    private Long answerId;
    private String answerValue;

    public static QuestionAnswerResponse from(QuestionAnswer questionAnswer) {
        return new QuestionAnswerResponse(
            questionAnswer.getReviewFormQuestion().getValue(),
            questionAnswer.getAnswer().getId(),
            questionAnswer.getAnswer().getValue()
        );
    }

    public static QuestionAnswerResponse of(ReviewFormQuestion question, Answer answer) {
        return new QuestionAnswerResponse(
            question.getValue(),
            answer.getId(),
            answer.getValue()
        );
    }
}
