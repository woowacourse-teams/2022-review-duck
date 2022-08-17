package com.reviewduck.member.dto.response;

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

    public static MemberResponse of(Member member, Member loginMember) {
        return new MemberResponse(
            member.equals(loginMember),
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
