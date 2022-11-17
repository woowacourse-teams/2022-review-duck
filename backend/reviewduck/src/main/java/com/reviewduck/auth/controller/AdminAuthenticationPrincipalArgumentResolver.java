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
import com.reviewduck.member.domain.Member;

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

        String token = extractToken(request);
        Member member = resolveMemberFromToken(token);

        return createAdmin(member);
    }

    private String extractToken(HttpServletRequest request) {
        validateAuthorization(request);
        return AuthorizationExtractor.extract(request);
    }

    private void validateAuthorization(HttpServletRequest request) {
        if (request.getHeader(HttpHeaders.AUTHORIZATION) == null) {
            throw new AuthorizationException("권한이 없는 사용자입니다.");
        }
    }

    private Member resolveMemberFromToken(String token) {
        jwtTokenProvider.validateAccessToken(token);

        long memberId = Long.parseLong(jwtTokenProvider.getAccessTokenPayload(token));
        return adminMemberService.findMemberById(memberId);
    }

    private AdminMemberDto createAdmin(Member member) {
        AdminMemberDto memberDto = AdminMemberDto.from(member);

        validateAdmin(memberDto);
        return memberDto;
    }

    private void validateAdmin(AdminMemberDto member) {
        if (!member.isAdmin()) {
            throw new AuthorizationException("어드민 권한이 없습니다.");
        }
    }
}
