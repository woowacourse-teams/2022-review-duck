package com.reviewduck.dto.response;

import java.util.List;
import java.util.stream.Collectors;

import com.reviewduck.domain.Template;

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
    private List<QuestionResponse> questions;

    public static TemplateResponse from(Template template) {
        List<QuestionResponse> questionResponses = template.getQuestions().stream()
            .map(QuestionResponse::from)
            .collect(Collectors.toUnmodifiableList());

        return new TemplateResponse(template.getId(), template.getTemplateTitle(), template.getTemplateDescription(),
            questionResponses);
    }
}
