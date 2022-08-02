package com.reviewduck.auth.support;

import java.util.Objects;

import javax.servlet.http.HttpServletRequest;

import org.springframework.http.HttpHeaders;

import com.reviewduck.auth.exception.AuthorizationException;

public class AuthorizationExtractor {
    private static final String BEARER_TYPE = "Bearer";

    public static String extract(HttpServletRequest request) {
        String token = request.getHeader(HttpHeaders.AUTHORIZATION);
        validateNullToken(token);
        validateTokenType(token);
        return token.substring(BEARER_TYPE.length() + 1);
    }

    private static void validateNullToken(String token) {
        if (Objects.isNull(token)) {
            throw new AuthorizationException("토큰이 존재하지 않습니다.");
        }
    }

    private static void validateTokenType(String token) {
        if (!token.toLowerCase().startsWith(BEARER_TYPE.toLowerCase())) {
            throw new AuthorizationException("식별되지 않는 토큰입니다.");
        }
    }
}
