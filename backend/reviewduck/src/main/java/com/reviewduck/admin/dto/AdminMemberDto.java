package com.reviewduck.admin.dto;

import java.time.LocalDateTime;
import java.util.Objects;

import com.reviewduck.member.domain.Member;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class AdminMemberDto {

    private boolean isAdmin;
    private long id;
    private String socialId;
    private String socialNickname;
    private String nickname;
    private String profileUrl;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static AdminMemberDto from(Member member) {
        return new AdminMemberDto(
            member.isAdmin(),
            member.getId(),
            member.getSocialId(),
            member.getSocialNickname(),
            member.getNickname(),
            member.getProfileUrl(),
            member.getCreatedAt(),
            member.getUpdatedAt()
        );
    }

    public boolean getIsAdmin() {
        return isAdmin;
    }
}
