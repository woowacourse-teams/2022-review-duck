package com.reviewduck.member.dto.response;

import java.time.LocalDateTime;
import java.util.Objects;

import com.reviewduck.member.domain.Member;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class MemberDto {

    private boolean isMine;
    private long id;
    private String socialId;
    private String socialNickname;
    private String nickname;
    private String profileUrl;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static MemberDto from(Member member) {
        return new MemberDto(
            true,
            member.getId(),
            member.getSocialId(),
            member.getSocialNickname(),
            member.getNickname(),
            member.getProfileUrl(),
            member.getCreatedAt(),
            member.getUpdatedAt()
        );
    }

    public static MemberDto of(Member member, MemberDto loginMember) {
        return new MemberDto(
            Objects.equals(member.getId(), loginMember.getId()),
            member.getId(),
            member.getSocialId(),
            member.getSocialNickname(),
            member.getNickname(),
            member.getProfileUrl(),
            member.getCreatedAt(),
            member.getUpdatedAt()
        );
    }

    public boolean getIsMine() {
        return isMine;
    }
}
