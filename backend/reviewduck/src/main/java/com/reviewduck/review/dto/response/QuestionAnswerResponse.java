package com.reviewduck.review.dto.response;

import com.reviewduck.review.domain.QuestionAnswer;

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
}
