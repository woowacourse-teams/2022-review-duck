package com.reviewduck.admin.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.reviewduck.review.domain.Answer;
import com.reviewduck.review.domain.QuestionAnswer;
import com.reviewduck.review.domain.ReviewFormQuestion;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class AdminQuestionAnswerResponse {

    @JsonProperty("id")
    private long questionAnswerId;
    private long questionId;
    private String questionValue;
    private long answerId;
    private String answerValue;

    public static AdminQuestionAnswerResponse from(QuestionAnswer questionAnswer) {
        ReviewFormQuestion question = questionAnswer.getReviewFormQuestion();
        Answer answer = questionAnswer.getAnswer();
        return new AdminQuestionAnswerResponse(question.getId(), question.getId(), question.getValue(),
            answer.getId(), answer.getValue());
    }
}
