package com.reviewduck.auth.controller;

import java.util.Map;
import java.util.function.BiFunction;
import java.util.regex.Pattern;

import javax.servlet.http.HttpServletRequest;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum URIPattern {

    TemplateFindRequestPattern(Pattern.compile("/api/templates.*"), (params, paramName) -> true),

    MemberReviewFormFindRequestPattern(Pattern.compile("/api/review-forms"), Map::containsKey),

    MemberReviewFindRequestPattern(Pattern.compile("/api/reviews"),
        (params, paramName) -> params.containsKey(paramName) || params.isEmpty()),

    MemberFindRequestPattern(Pattern.compile("/api/members/[0-9]+"), (params, paramName) -> true),

    ReviewFormFindRequestPattern(Pattern.compile("/api/review-forms/[0-9A-Z]+"), (params, paramName) -> true);

    private final Pattern pattern;
    private final BiFunction<Map<String, String[]>, String, Boolean> containsParam;

    public boolean match(HttpServletRequest request, String paramName) {
        return pattern.matcher(request.getRequestURI()).matches()
            && containsParam.apply(request.getParameterMap(), paramName);
    }
}
