package com.reviewduck.review.controller;

import java.util.Arrays;
import java.util.function.BiFunction;

import com.reviewduck.member.domain.Member;
import com.reviewduck.review.domain.Review;
import com.reviewduck.review.dto.response.ReviewAbstractResponse;
import com.reviewduck.review.dto.response.ReviewResponse;
import com.reviewduck.review.dto.response.ReviewSheetResponse;

import lombok.AllArgsConstructor;

@AllArgsConstructor
public enum DisplayType {

    LIST("list", ReviewResponse::of),
    SHEET("sheet", ReviewSheetResponse::of);

    private final String value;
    private final BiFunction<Member, Review, ReviewAbstractResponse> responseBuilder;

    public static BiFunction<Member, Review, ReviewAbstractResponse> builderOf(String displayType) {
        return Arrays.stream(values())
            .filter(it -> displayType.equals(it.value))
            .findFirst()
            .orElse(LIST)
            .responseBuilder;
    }
}
