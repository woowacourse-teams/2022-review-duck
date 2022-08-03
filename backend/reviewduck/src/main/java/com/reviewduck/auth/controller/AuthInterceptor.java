package com.reviewduck.auth.controller;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.http.HttpMethod;
import org.springframework.web.servlet.HandlerInterceptor;

import com.reviewduck.auth.support.AuthorizationExtractor;
import com.reviewduck.auth.support.JwtTokenProvider;

import lombok.AllArgsConstructor;

@AllArgsConstructor
public class AuthInterceptor implements HandlerInterceptor {

    private final JwtTokenProvider jwtTokenProvider;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response,
        Object handler) {

        if (isPreflight(request)) {
            return true;
        }

        validateToken(request);
        return true;
    }

    public boolean isPreflight(HttpServletRequest request) {
        return request.getMethod().equals(HttpMethod.OPTIONS.toString());
    }

    public void validateToken(HttpServletRequest request) {
        String token = AuthorizationExtractor.extract(request);
        jwtTokenProvider.validateToken(token);
    }
}
