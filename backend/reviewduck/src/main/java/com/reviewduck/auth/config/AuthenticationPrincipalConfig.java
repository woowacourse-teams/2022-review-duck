package com.reviewduck.auth.config;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import com.reviewduck.admin.service.AdminMemberService;
import com.reviewduck.auth.controller.AdminAuthenticationPrincipalArgumentResolver;
import com.reviewduck.auth.controller.AuthInterceptor;
import com.reviewduck.auth.controller.AuthenticationPrincipalArgumentResolver;
import com.reviewduck.auth.support.JwtTokenProvider;
import com.reviewduck.member.service.MemberService;

import lombok.AllArgsConstructor;

@Configuration
@AllArgsConstructor
public class AuthenticationPrincipalConfig implements WebMvcConfigurer {

    private final JwtTokenProvider jwtTokenProvider;
    private final MemberService memberService;
    private final AdminMemberService adminMemberService;

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new AuthInterceptor(jwtTokenProvider))
            .addPathPatterns("/api/**")
            .excludePathPatterns("/api/login/**")
            .excludePathPatterns("/api/review-forms/*/reviews")
            .excludePathPatterns("/api/reviews/public")
            .excludePathPatterns("/api/reviews/*/likes");
    }

    @Override
    public void addArgumentResolvers(List<HandlerMethodArgumentResolver> argumentResolvers) {
        argumentResolvers.add(createAuthenticationPrincipalArgumentResolver());
        argumentResolvers.add(createAdminAuthenticationPrincipalArgumentResolver());
    }

    @Bean
    public AuthenticationPrincipalArgumentResolver createAuthenticationPrincipalArgumentResolver() {
        return new AuthenticationPrincipalArgumentResolver(jwtTokenProvider, memberService);
    }

    @Bean
    public AdminAuthenticationPrincipalArgumentResolver createAdminAuthenticationPrincipalArgumentResolver() {
        return new AdminAuthenticationPrincipalArgumentResolver(jwtTokenProvider, adminMemberService);
    }
}
