package com.reviewduck.template.dto.response;

import java.sql.Timestamp;

import com.reviewduck.template.domain.Template;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class TemplateInfoResponse {

    private Long id;
    private String title;
    private String description;
    private long updatedAt;
    private int usedCount;

    public static TemplateInfoResponse from(Template template) {
        return new TemplateInfoResponse(
            template.getId(),
            template.getTemplateTitle(),
            template.getTemplateDescription(),
            Timestamp.valueOf(template.getUpdatedAt()).getTime(),
            template.getUsedCount()
        );
    }
}
