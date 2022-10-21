package com.reviewduck.admin.dto.response;

import java.time.LocalDateTime;

import com.reviewduck.member.domain.Member;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class AdminMemberResponse {

    private long id;
    private String socialId;
    private String socialNickname;
    private String nickname;
    private String profileUrl;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static AdminMemberResponse from(Member member) {
        return new AdminMemberResponse(member.getId(), member.getSocialId(), member.getSocialNickname(),
            member.getNickname(), member.getProfileUrl(), member.getCreatedAt(), member.getUpdatedAt());
    }
}
