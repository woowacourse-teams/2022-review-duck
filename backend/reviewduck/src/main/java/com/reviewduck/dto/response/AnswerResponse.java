package com.reviewduck.dto.response;

import com.reviewduck.domain.Answer;
import com.reviewduck.domain.Question;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class AnswerResponse {

    private String questionValue;
    private String answerValue;

    public static AnswerResponse of(Question question, Answer answer) {
        return new AnswerResponse(question.getValue(), answer.getValue());
    }
}
