package com.reviewduck.review.dto.response;

import com.reviewduck.review.domain.Answer;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class AnswerResponse {

    private Long id;
    private String value;

    public static AnswerResponse from(Answer answer) {
        return new AnswerResponse(answer.getId(), answer.getValue());
    }
}
