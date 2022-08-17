package com.reviewduck.admin.dto.response;

import java.time.LocalDateTime;

import com.reviewduck.member.domain.Member;
import com.reviewduck.template.domain.Template;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class AdminTemplateInfoResponse {

    private Long id;
    private Long memberId;
    private String memberProfileUrl;
    private String memberNickname;
    private String templateTitle;
    private String templateDescription;
    private int usedCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static AdminTemplateInfoResponse from(Template template) {
        Member member = template.getMember();
        return new AdminTemplateInfoResponse(template.getId(), member.getId(),
            member.getProfileUrl(), member.getNickname(), template.getTemplateTitle(),
            template.getTemplateDescription(), template.getUsedCount(), template.getCreatedAt(),
            template.getUpdatedAt());
    }
}
