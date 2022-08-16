package com.reviewduck.template.dto.response;

import com.reviewduck.template.domain.Template;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class TemplateSummaryResponse {

    private TemplateInfoResponse info;
    private CreatorResponse creator;

    public static TemplateSummaryResponse from(Template template) {
        return new TemplateSummaryResponse(
            TemplateInfoResponse.from(template),
            CreatorResponse.from(template.getMember())
        );
    }
}
