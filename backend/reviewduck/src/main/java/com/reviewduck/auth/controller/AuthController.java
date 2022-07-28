package com.reviewduck.auth.controller;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.reviewduck.auth.dto.request.LoginRequest;
import com.reviewduck.auth.dto.response.TokenResponse;
import com.reviewduck.auth.dto.service.Tokens;
import com.reviewduck.auth.service.AuthService;

import io.swagger.v3.oas.annotations.Operation;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api")
@Slf4j
public class AuthController {
    private final AuthService authService;

    public AuthController(final AuthService authService) {
        this.authService = authService;
    }

    @Operation(summary = "로그인을 시도한다.")
    @PostMapping("/login")
    @ResponseStatus(HttpStatus.OK)
    public TokenResponse login(@RequestBody @Valid LoginRequest request, HttpServletResponse response) {

        log.info("uri={}, method = {}, request = {}",
            "/api/login", "POST", request.toString());

        Tokens tokens = authService.createTokens(request);

        ResponseCookie cookie = ResponseCookie.from("refreshToken", tokens.getRefreshToken())
            .maxAge(7 * 24 * 60 * 60)
            .path("/")
            .secure(true)
            .sameSite("None")
            .httpOnly(true)
            .build();
        response.setHeader("Set-Cookie", cookie.toString());

        return new TokenResponse(tokens.getAccessToken());
    }

    @Operation(summary = "리프레시 토큰을 사용한 로그인 연장을 시도한다.")
    @PostMapping("/login/refresh")
    @ResponseStatus(HttpStatus.OK)
    public TokenResponse refresh(@CookieValue(value = "refreshToken", required = false) Cookie cookie,
        HttpServletResponse response) {

        log.info("uri={}, method = {}", "/api/login/refresh", "POST");

        String refreshToken = cookie.getValue();
        authService.validateToken(refreshToken);
        Long memberId = Long.parseLong(authService.getPayload(refreshToken));
        Tokens tokens = authService.generateTokens(memberId);

        ResponseCookie refreshTokenCookie = ResponseCookie.from("refreshToken", tokens.getRefreshToken())
            .maxAge(7 * 24 * 60 * 60)
            .path("/")
            .secure(true)
            .sameSite("None")
            .httpOnly(true)
            .build();
        response.setHeader("Set-Cookie", refreshTokenCookie.toString());

        return new TokenResponse(tokens.getAccessToken());
    }

}
