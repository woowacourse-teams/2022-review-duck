package com.reviewduck.review.dto.controller.response;

import com.reviewduck.review.domain.Answer;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class AnswerResponse {

    private long id;
    private String value;

    public static AnswerResponse from(Answer answer) {
        return new AnswerResponse(answer.getId(), answer.getValue());
    }
}
