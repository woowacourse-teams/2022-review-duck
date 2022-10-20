package com.reviewduck.review.dto.controller.response;

import com.reviewduck.member.dto.response.MemberResponse;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class CreatorResponse {

    private Long id;
    private String nickname;
    private String socialNickname;
    private String profileUrl;

    public static CreatorResponse from(MemberResponse member) {
        return new CreatorResponse(
            Long.parseLong(member.getSocialId()),
            member.getNickname(),
            member.getSocialNickname(),
            member.getProfileUrl()
        );
    }
}
