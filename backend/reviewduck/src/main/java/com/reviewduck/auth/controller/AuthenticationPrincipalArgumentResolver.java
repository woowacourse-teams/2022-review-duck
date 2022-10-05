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
    public Member resolveArgument(MethodParameter parameter, ModelAndViewContainer mavContainer,
        NativeWebRequest webRequest, WebDataBinderFactory binderFactory) {

        HttpServletRequest request = (HttpServletRequest)webRequest.getNativeRequest();

        if (request.getHeader(HttpHeaders.AUTHORIZATION) == null) {
            return Member.getMemberNotLogin();
        }

        String token = AuthorizationExtractor.extract(request);

        jwtTokenProvider.validateToken(token);

        Long memberId = Long.parseLong(jwtTokenProvider.getPayload(token));

        return memberService.findById(memberId);
    }
}
