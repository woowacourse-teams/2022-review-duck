package com.reviewduck.auth.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
@AllArgsConstructor
@Getter
public class GithubTokenRequest {

    @JsonProperty("client_id")
    private String cliendId;

    @JsonProperty("client_secret")
    private String clientSecret;

    private String code;
}
