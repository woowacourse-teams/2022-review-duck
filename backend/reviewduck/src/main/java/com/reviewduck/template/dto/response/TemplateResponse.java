package com.reviewduck.template.dto.response;

import java.util.List;
import java.util.stream.Collectors;

import com.reviewduck.template.domain.Template;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class TemplateResponse {

    private TemplateInfoResponse info;
    private CreatorResponse creator;
    private List<TemplateQuestionResponse> questions;

    public static TemplateResponse from(Template template) {
        List<TemplateQuestionResponse> questions = template.getQuestions().stream()
            .map(TemplateQuestionResponse::from)
            .collect(Collectors.toUnmodifiableList());

        return new TemplateResponse(
            TemplateInfoResponse.from(template),
            CreatorResponse.from(template.getMember()),
            questions
        );
    }
}
