package com.reviewduck.dto.response;

import com.reviewduck.domain.Answer;
import com.reviewduck.domain.ReviewFormQuestion;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class AnswerResponse {

    private String questionValue;
    private String answerValue;

    public static AnswerResponse of(ReviewFormQuestion reviewFormQuestion, Answer answer) {
        return new AnswerResponse(reviewFormQuestion.getValue(), answer.getValue());
    }
}
