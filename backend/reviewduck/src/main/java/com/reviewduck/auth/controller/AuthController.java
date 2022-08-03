package com.reviewduck.auth.controller;

import static com.reviewduck.common.util.Logging.*;

import java.util.Objects;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.reviewduck.auth.dto.request.LoginRequest;
import com.reviewduck.auth.dto.response.TokenResponse;
import com.reviewduck.auth.dto.service.TokensDto;
import com.reviewduck.auth.exception.AuthorizationException;
import com.reviewduck.auth.service.AuthService;

import io.swagger.v3.oas.annotations.Operation;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api")
@AllArgsConstructor
public class AuthController {

    private static final int SEVEN_DAYS = 7 * 24 * 60 * 60;
    
    private final AuthService authService;

    @Operation(summary = "로그인을 시도한다.")
    @PostMapping("/login")
    @ResponseStatus(HttpStatus.OK)
    public TokenResponse login(@RequestBody @Valid LoginRequest request, HttpServletResponse response) {

        info("/api/login", "POST", request.toString());

        TokensDto tokensDto = authService.createTokens(request);

        ResponseCookie cookie = createRefreshToken(tokensDto);
        response.setHeader("Set-Cookie", cookie.toString());

        return new TokenResponse(tokensDto.getAccessToken());
    }

    @Operation(summary = "리프레시 토큰을 사용한 로그인 연장을 시도한다.")
    @GetMapping("/login/refresh")
    @ResponseStatus(HttpStatus.OK)
    public TokenResponse refresh(@CookieValue(value = "refreshToken", required = false) Cookie cookie,
        HttpServletResponse response) {

        info("/api/login/refresh", "POST","");

        validateCookie(cookie);

        String refreshToken = cookie.getValue();
        TokensDto tokensDto = authService.regenerateTokens(refreshToken);

        ResponseCookie refreshTokenCookie = createRefreshToken(tokensDto);
        response.setHeader("Set-Cookie", refreshTokenCookie.toString());

        return new TokenResponse(tokensDto.getAccessToken());
    }

    private void validateCookie(Cookie cookie) {
        if (Objects.isNull(cookie)) {
            throw new AuthorizationException("리프레시 토큰이 없습니다.");
        }
    }

    @Operation(summary = "로그아웃을 시도한다.")
    @GetMapping("/logout")
    @ResponseStatus(HttpStatus.OK)
    public void logout(@CookieValue(value = "refreshToken", required = false) Cookie cookie,
        HttpServletResponse response) {

        info( "/api/login", "POST","");

        if (!Objects.isNull(cookie)) {
            cookie.setMaxAge(0);
            response.addCookie(cookie);
        }
    }

    private ResponseCookie createRefreshToken(TokensDto tokensDto) {
        return ResponseCookie.from("refreshToken", tokensDto.getRefreshToken())
            .maxAge(SEVEN_DAYS)
            .path("/")
            .secure(true)
            .sameSite("None")
            .httpOnly(true)
            .build();
    }
}
