package com.reviewduck.template.dto.response;

import java.util.List;
import java.util.stream.Collectors;

import com.reviewduck.template.domain.Template;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class MyTemplatesResponse {
    private int numberOfTemplates;
    private List<MyTemplateResponse> templates;

    public static MyTemplatesResponse from(List<Template> templates) {
        List<MyTemplateResponse> myTemplateResponses = templates.stream()
            .map(MyTemplateResponse::from)
            .collect(Collectors.toUnmodifiableList());

        return new MyTemplatesResponse(templates.size(), myTemplateResponses);
    }
}
