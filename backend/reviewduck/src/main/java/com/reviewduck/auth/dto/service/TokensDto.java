package com.reviewduck.auth.dto.service;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class TokensDto {

    private String accessToken;
    private String refreshToken;
}
