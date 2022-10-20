package com.reviewduck.member.dto.response;

import java.util.Objects;

import com.reviewduck.member.domain.Member;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class MemberResponse {

    private boolean isMine;
    private String socialId;
    private String socialNickname;
    private String nickname;
    private String profileUrl;

    public static MemberResponse from(Member member) {
        return new MemberResponse(
            true,
            member.getSocialId(),
            member.getSocialNickname(),
            member.getNickname(),
            member.getProfileUrl()
            );
    }

    public static MemberResponse of(Member member, long myMemberId) {
        return new MemberResponse(
            Objects.equals(member.getId(), myMemberId),
            member.getSocialId(),
            member.getSocialNickname(),
            member.getNickname(),
            member.getProfileUrl()
        );
    }

    public boolean getIsMine() {
        return isMine;
    }
}
