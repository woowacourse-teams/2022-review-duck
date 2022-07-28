package com.reviewduck.template.dto.response;

import java.sql.Timestamp;

import com.reviewduck.template.domain.Template;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class MyTemplateResponse {
    private Long templateId;
    private long updatedAt;
    private String templateTitle;
    private String templateDescription;

    public static MyTemplateResponse from(Template template) {
        long updatedAt = Timestamp.valueOf(template.getUpdatedAt()).getTime();

        return new MyTemplateResponse(template.getId(), updatedAt, template.getTemplateTitle(),
            template.getTemplateDescription());
    }
}
