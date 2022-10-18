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
public class MemberTemplatesResponse {

    private long numberOfTemplates;
    private boolean isLastPage;
    private boolean isMine;
    private List<MemberTemplateResponse> templates;

    public static MemberTemplatesResponse of(Page<Template> templates, String socialId, boolean isMine) {
        List<MemberTemplateResponse> memberTemplateResponses = templates.stream()
            .map(MemberTemplateResponse::from)
            .collect(Collectors.toUnmodifiableList());

        return new MemberTemplatesResponse(
            templates.getTotalElements(),
            templates.isLast(),
            isMine,
            memberTemplateResponses);
    }

    public boolean getIsMine() {
        return isMine;
    }

    public boolean getIsLastPage() {
        return isLastPage;
    }

}
