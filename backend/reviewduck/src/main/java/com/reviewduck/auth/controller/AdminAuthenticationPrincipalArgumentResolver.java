package com.reviewduck.auth.controller;

import javax.servlet.http.HttpServletRequest;

import org.springframework.core.MethodParameter;
import org.springframework.http.HttpHeaders;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;

import com.reviewduck.admin.dto.AdminMemberDto;
import com.reviewduck.admin.service.AdminMemberService;
import com.reviewduck.auth.exception.AuthorizationException;
import com.reviewduck.auth.support.AdminAuthenticationPrincipal;
import com.reviewduck.auth.support.AuthorizationExtractor;
import com.reviewduck.auth.support.JwtTokenProvider;

import lombok.AllArgsConstructor;

@AllArgsConstructor
public class AdminAuthenticationPrincipalArgumentResolver implements HandlerMethodArgumentResolver {

    private final JwtTokenProvider jwtTokenProvider;
    private final AdminMemberService adminMemberService;

    @Override
    public boolean supportsParameter(MethodParameter parameter) {
        return parameter.hasParameterAnnotation(AdminAuthenticationPrincipal.class);
    }

    @Override
    public AdminMemberDto resolveArgument(MethodParameter parameter, ModelAndViewContainer mavContainer,
        NativeWebRequest webRequest, WebDataBinderFactory binderFactory) {

        HttpServletRequest request = (HttpServletRequest)webRequest.getNativeRequest();

        if (request.getHeader(HttpHeaders.AUTHORIZATION) == null) {
            throw new AuthorizationException("권한이 없는 사용자입니다.");
        }

        String token = AuthorizationExtractor.extract(request);

        jwtTokenProvider.validateAccessToken(token);

        long memberId = Long.parseLong(jwtTokenProvider.getAccessTokenPayload(token));

        return AdminMemberDto.from(adminMemberService.findMemberById(memberId));
    }
}
