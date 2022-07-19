package com.reviewduck.dto.response;

import java.util.List;
import java.util.stream.Collectors;

import com.reviewduck.domain.Template;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
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
