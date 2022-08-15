package com.reviewduck.template.dto.response;

import java.util.List;
import java.util.stream.Collectors;

import com.reviewduck.template.domain.Template;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class TemplatesResponse {

    private List<TemplateSummaryResponse> templates;

    public static TemplatesResponse from(List<Template> templates) {
        return new TemplatesResponse(
            templates.stream()
                .map(TemplateSummaryResponse::from)
                .collect(Collectors.toUnmodifiableList())
        );
    }
}
