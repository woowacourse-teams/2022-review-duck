package com.reviewduck.template.dto.response;

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
    private boolean isMine;
    private List<MemberTemplateResponse> templates;

    public static MemberTemplatesResponse of(Page<Template> templates, String socialId, Member member) {
        List<MemberTemplateResponse> memberTemplateResponses = templates.stream()
            .map(MemberTemplateResponse::from)
            .collect(Collectors.toUnmodifiableList());

        boolean isMine = member.getSocialId().equals(socialId);

        return new MemberTemplatesResponse(templates.getTotalElements(), isMine, memberTemplateResponses);
    }

    public boolean getIsMine() {
        return isMine;
    }
}
