package com.reviewduck.review.dto.controller.response;

import java.util.Arrays;
import java.util.List;
import java.util.function.BiFunction;
import java.util.stream.Collectors;

import com.reviewduck.review.domain.Review;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public enum ReviewDisplayBuilder {

    LIST_DISPLAY("list", ReviewResponse::of),
    SHEET_DISPLAY("sheet", ReviewSheetResponse::of);

    private final String value;
    private final BiFunction<Long, Review, ReviewAbstractResponse> responseBuilder;

    public static ReviewDisplayBuilder of(String displayType) {
        return Arrays.stream(values())
            .filter(it -> displayType.equals(it.value))
            .findFirst()
            .orElse(LIST_DISPLAY);
    }

    public List<ReviewAbstractResponse> createResponseFrom(long memberId, List<Review> reviews) {
        return reviews.stream()
            .map(review -> responseBuilder.apply(memberId, review))
            .collect(Collectors.toUnmodifiableList());
    }
}
