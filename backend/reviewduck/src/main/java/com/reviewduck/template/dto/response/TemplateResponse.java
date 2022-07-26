package com.reviewduck.template.dto.response;

import java.util.List;
import java.util.stream.Collectors;

import com.reviewduck.template.domain.Template;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = AccessLevel.PRIVATE)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class TemplateResponse {

    private Long templateId;
    private String templateTitle;
    private String templateDescription;
    private List<TemplateQuestionResponse> questions;

    public static TemplateResponse from(Template template) {
        List<TemplateQuestionResponse> questionResponses = template.getQuestions().stream()
            .map(TemplateQuestionResponse::from)
            .collect(Collectors.toUnmodifiableList());

        return new TemplateResponse(template.getId(), template.getTemplateTitle(), template.getTemplateDescription(),
            questionResponses);
    }
}
