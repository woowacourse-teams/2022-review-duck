package com.reviewduck.template.dto.controller.response;

import com.reviewduck.member.domain.Member;
import com.reviewduck.template.domain.Template;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class TemplateSummaryResponse {

    private boolean isCreator;
    private TemplateInfoResponse info;
    private CreatorResponse creator;

    public static TemplateSummaryResponse of(Template template, long memberId) {
        return new TemplateSummaryResponse(
            template.isMine(memberId),
            TemplateInfoResponse.from(template),
            CreatorResponse.from(template.getMember())
        );
    }

    public boolean getIsCreator() {
        return isCreator;
    }
}
