package com.reviewduck.template.dto.response;

import com.reviewduck.template.domain.Template;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class TemplateCreateResponse {

    private Long templateId;

    public static TemplateCreateResponse from(Template template) {
        return new TemplateCreateResponse(template.getId());
    }
}
