package com.reviewduck.auth.controller;

import javax.servlet.http.HttpServletRequest;

import org.springframework.core.MethodParameter;
import org.springframework.http.HttpHeaders;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;

import com.reviewduck.auth.support.AuthenticationPrincipal;
import com.reviewduck.auth.support.AuthorizationExtractor;
import com.reviewduck.auth.support.JwtTokenProvider;
import com.reviewduck.member.domain.Member;
import com.reviewduck.member.dto.MemberDto;
import com.reviewduck.member.service.MemberService;

import lombok.AllArgsConstructor;

@AllArgsConstructor
public class AuthenticationPrincipalArgumentResolver implements HandlerMethodArgumentResolver {

    private final JwtTokenProvider jwtTokenProvider;
    private final MemberService memberService;

    @Override
    public boolean supportsParameter(MethodParameter parameter) {
        return parameter.hasParameterAnnotation(AuthenticationPrincipal.class);
    }

    @Override
    public MemberDto resolveArgument(MethodParameter parameter, ModelAndViewContainer mavContainer,
        NativeWebRequest webRequest, WebDataBinderFactory binderFactory) {

        HttpServletRequest request = (HttpServletRequest)webRequest.getNativeRequest();

        return resolveMemberFormRequest(request);
    }

    private MemberDto resolveMemberFormRequest(HttpServletRequest request) {

        if(isUnauthorized(request)) {
            return MemberDto.getMemberNotLogin();
        }

        String token = AuthorizationExtractor.extract(request);
        Member member = resolveMemberFromToken(token);

        return MemberDto.from(member);
    }

    private boolean isUnauthorized(HttpServletRequest request) {
        return request.getHeader(HttpHeaders.AUTHORIZATION) == null;
    }

    private Member resolveMemberFromToken(String token) {
        jwtTokenProvider.validateAccessToken(token);

        long memberId = Long.parseLong(jwtTokenProvider.getAccessTokenPayload(token));
        return memberService.findById(memberId);
    }
}
