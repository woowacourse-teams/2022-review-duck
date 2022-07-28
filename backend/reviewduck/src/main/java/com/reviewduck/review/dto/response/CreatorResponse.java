package com.reviewduck.review.dto.response;

import com.reviewduck.member.domain.Member;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class CreatorResponse {
    private String nickname;
    private String profileUrl;

    public static CreatorResponse of(Member member) {
        return new CreatorResponse(member.getNickname(), member.getProfileUrl());
    }
}
