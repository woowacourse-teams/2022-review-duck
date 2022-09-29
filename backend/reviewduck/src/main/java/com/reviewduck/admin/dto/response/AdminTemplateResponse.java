package com.reviewduck.admin.dto.response;

import java.util.List;
import java.util.stream.Collectors;

import com.reviewduck.template.domain.Template;
import com.reviewduck.template.dto.controller.response.TemplateQuestionResponse;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class AdminTemplateResponse {

    private AdminTemplateInfoResponse templateInfo;
    private List<TemplateQuestionResponse> questions;

    public static AdminTemplateResponse from(Template template) {
        AdminTemplateInfoResponse templateInfoResponse = AdminTemplateInfoResponse.from(template);
        List<TemplateQuestionResponse> questionResponses = template.getQuestions().stream()
            .map(TemplateQuestionResponse::from)
            .collect(Collectors.toUnmodifiableList());

        return new AdminTemplateResponse(templateInfoResponse, questionResponses);
    }
}
