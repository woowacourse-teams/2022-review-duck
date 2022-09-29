package com.reviewduck.template.dto.controller.response;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;

import com.reviewduck.member.domain.Member;
import com.reviewduck.template.domain.Template;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class TemplatesResponse {

    private long numberOfTemplates;
    private boolean isLastPage;
    private List<TemplateSummaryResponse> templates;

    public static TemplatesResponse of(Page<Template> templates, Member member) {
        return new TemplatesResponse(
            templates.getTotalElements(),
            templates.isLast(),
            templates.stream()
                .map(template -> TemplateSummaryResponse.of(template, member))
                .collect(Collectors.toUnmodifiableList())
        );
    }

    public boolean getIsLastPage() {
        return isLastPage;
    }

}
