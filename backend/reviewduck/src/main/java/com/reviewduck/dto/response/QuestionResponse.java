package com.reviewduck.dto.response;

import com.reviewduck.domain.ReviewFormQuestion;
import com.reviewduck.domain.TemplateQuestion;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class QuestionResponse {

    private Long questionId;
    private String questionValue;

    public static QuestionResponse from(ReviewFormQuestion reviewFormQuestion) {
        return new QuestionResponse(reviewFormQuestion.getId(), reviewFormQuestion.getValue());
    }

    public static QuestionResponse from(TemplateQuestion question) {
        return new QuestionResponse(question.getId(), question.getValue());
    }
}
