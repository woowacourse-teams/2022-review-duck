package com.reviewduck.member.dto.response;

import java.time.LocalDateTime;
import java.util.Objects;

import com.reviewduck.member.domain.Member;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class MemberResponse {

    private boolean isMine;
    private Long id;
    private String socialId;
    private String socialNickname;
    private String nickname;
    private String profileUrl;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static MemberResponse from(Member member) {
        return new MemberResponse(
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

    public static MemberResponse of(MemberResponse member, MemberResponse loginMember) {
        return new MemberResponse(
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

    public Member toEntity() {
        return new Member(id, socialId, socialNickname, nickname, profileUrl);
    }
}
