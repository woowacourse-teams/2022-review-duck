package com.reviewduck.template.dto.controller.response;

import com.reviewduck.template.domain.TemplateQuestion;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class TemplateQuestionResponse {

    private Long id;
    private String value;
    private String description;

    public static TemplateQuestionResponse from(TemplateQuestion question) {
        return new TemplateQuestionResponse(
            question.getId(),
            question.getValue(),
            question.getDescription());
    }
}
