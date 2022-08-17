package com.reviewduck.template.dto.response;

import java.util.List;
import java.util.stream.Collectors;

import com.reviewduck.member.domain.Member;
import com.reviewduck.template.domain.Template;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class MemberTemplatesResponse {

    private int numberOfTemplates;
    private boolean isMine;
    private List<MemberTemplateResponse> templates;

    public static MemberTemplatesResponse of(List<Template> templates, String socialId, Member member) {
        List<MemberTemplateResponse> memberTemplateRespons = templates.stream()
            .map(MemberTemplateResponse::from)
            .collect(Collectors.toUnmodifiableList());

        boolean isMine = member.getSocialId().equals(socialId);

        return new MemberTemplatesResponse(templates.size(), isMine, memberTemplateRespons);
    }

    public boolean getIsMine() {
        return isMine;
    }
}
