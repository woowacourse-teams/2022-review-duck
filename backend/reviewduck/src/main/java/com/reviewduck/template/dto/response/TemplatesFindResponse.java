package com.reviewduck.template.dto.response;

import java.util.List;
import java.util.stream.Collectors;

import com.reviewduck.template.domain.Template;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class TemplatesFindResponse {

    private List<TemplateResponse> templates;

    public static TemplatesFindResponse from(List<Template> templates) {
        List<TemplateResponse> templateResponses = templates.stream()
            .map(TemplateResponse::from)
            .collect(Collectors.toUnmodifiableList());

        return new TemplatesFindResponse(templateResponses);
    }
}
