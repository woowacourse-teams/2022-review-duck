package com.reviewduck.review.dto.response;

import com.reviewduck.member.domain.Member;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class MemberResponse {

    private String nickname;
    private String profileUrl;

    public static MemberResponse from(Member member) {
        return new MemberResponse(member.getNickname(), member.getProfileUrl());
    }
}
