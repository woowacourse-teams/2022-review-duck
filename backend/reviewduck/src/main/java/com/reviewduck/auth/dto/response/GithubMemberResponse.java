package com.reviewduck.auth.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.reviewduck.member.domain.Member;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@AllArgsConstructor(access = AccessLevel.PRIVATE)
@NoArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class GithubMemberResponse {

    @JsonProperty("id")
    private String socialId;

    @JsonProperty("login")
    private String socialNickname;

    @JsonProperty("name")
    private String nickname;

    @JsonProperty("avatar_url")
    private String avatarUrl;

    public Member toMember() {
        if (nickname == null) {
            nickname = socialNickname;
        }
        return new Member(socialId, socialNickname, nickname, avatarUrl);
    }
}
