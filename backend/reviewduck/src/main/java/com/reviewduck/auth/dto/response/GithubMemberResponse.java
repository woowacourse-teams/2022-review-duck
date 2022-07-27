package com.reviewduck.auth.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.reviewduck.member.domain.Member;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class GithubMemberResponse {

    @JsonProperty("login")
    private String socialId;

    @JsonProperty("name")
    private String nickname;

    @JsonProperty("avatar_url")
    private String avatarUrl;

    public Member toMember() {
        return new Member(nickname, socialId, avatarUrl);
    }
}
