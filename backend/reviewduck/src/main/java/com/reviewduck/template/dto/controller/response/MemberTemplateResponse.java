package com.reviewduck.template.dto.controller.response;

import java.util.List;
import java.util.stream.Collectors;

import com.reviewduck.template.domain.Template;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class MemberTemplateResponse {

    private TemplateInfoResponse info;
    private List<TemplateQuestionResponse> questions;

    public static MemberTemplateResponse from(Template template) {
        List<TemplateQuestionResponse> questions = template.getQuestions().stream()
            .map(TemplateQuestionResponse::from)
            .collect(Collectors.toUnmodifiableList());

        return new MemberTemplateResponse(
            TemplateInfoResponse.from(template),
            questions
        );
    }
}
