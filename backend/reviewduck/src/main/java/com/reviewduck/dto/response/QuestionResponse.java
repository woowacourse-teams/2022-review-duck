package com.reviewduck.dto.response;

import com.reviewduck.domain.Question;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class QuestionResponse {

    private Long questionId;
    private String questionValue;

    public static QuestionResponse from(Question question) {
        return new QuestionResponse(question.getId(), question.getValue());
    }
}
