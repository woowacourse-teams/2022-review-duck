package com.reviewduck.auth.controller;

import java.util.function.BiFunction;
import java.util.regex.Pattern;

import javax.servlet.http.HttpServletRequest;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum URIPattern {

    TemplateFindRequestPattern(Pattern.compile("/api/templates.*"), (request, paramName) -> true),

    MemberReviewFormFindRequestPattern(Pattern.compile("/api/review-forms"),
        (request, paramName) -> request.getParameterMap().containsKey(paramName)),

    MemberReviewFindRequestPattern(Pattern.compile("/api/reviews"),
        (request, paramName) -> request.getParameterMap().containsKey(paramName)),

    MemberFindRequestPattern(Pattern.compile("/api/members/[0-9]+"), (request, paramName) -> true);

    private final Pattern pattern;
    private final BiFunction<HttpServletRequest, String, Boolean> containsParam;

    public boolean match(HttpServletRequest request, String paramName) {
        return pattern.matcher(request.getRequestURI()).matches()
            && containsParam.apply(request, paramName);
    }
}
