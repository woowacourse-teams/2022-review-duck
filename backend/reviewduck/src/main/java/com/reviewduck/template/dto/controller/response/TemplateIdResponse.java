package com.reviewduck.template.dto.controller.response;

import com.reviewduck.template.domain.Template;
import com.reviewduck.template.service.TemplateDto;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class TemplateIdResponse {

    private Long templateId;

    public static TemplateIdResponse from(TemplateDto template) {
        return new TemplateIdResponse(template.getId());
    }
}
