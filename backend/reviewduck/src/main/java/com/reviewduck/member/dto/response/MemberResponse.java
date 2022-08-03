package com.reviewduck.member.dto.response;

import com.reviewduck.member.domain.Member;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class MemberResponse {
    
    private String socialId;
    private String socialNickname;
    private String nickname;
    private String profileUrl;

    public static MemberResponse from(Member member) {
        return new MemberResponse(member.getSocialId(), member.getSocialNickname(), member.getNickname(), member.getProfileUrl());
    }
}
