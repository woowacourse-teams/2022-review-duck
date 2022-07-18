package com.reviewduck.dto.response;

import com.reviewduck.domain.Template;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class TemplateCodeResponse {

    private String templateCode;

    public static TemplateCodeResponse from(Template template) {
        return new TemplateCodeResponse(template.getCode());
    }
}
