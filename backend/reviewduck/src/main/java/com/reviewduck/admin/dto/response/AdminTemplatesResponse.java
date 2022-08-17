package com.reviewduck.admin.dto.response;

import java.util.List;
import java.util.stream.Collectors;

import com.reviewduck.template.domain.Template;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class AdminTemplatesResponse {

    private List<AdminTemplateInfoResponse> templates;

    public static AdminTemplatesResponse from(List<Template> templates) {
        List<AdminTemplateInfoResponse> templatesResponse = templates.stream()
            .map(AdminTemplateInfoResponse::from)
            .collect(Collectors.toUnmodifiableList());

        return new AdminTemplatesResponse(templatesResponse);
    }
}
