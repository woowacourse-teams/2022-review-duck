package com.reviewduck.review.dto.response;

import com.reviewduck.member.domain.Member;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class CreatorResponse {

    private String nickname;
    private String profileUrl;

    public static CreatorResponse from(Member member) {
        return new CreatorResponse(member.getNickname(), member.getProfileUrl());
    }
}
