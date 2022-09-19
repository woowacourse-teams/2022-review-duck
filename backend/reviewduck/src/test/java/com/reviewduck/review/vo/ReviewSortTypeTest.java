package com.reviewduck.review.vo;

import static org.assertj.core.api.Assertions.*;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.NullAndEmptySource;

class ReviewSortTypeTest {

    @Test
    @DisplayName("파라미터에 맞는 정렬 기준을 반환한다.")
    void getSortBy() {
        assertThat(ReviewSortType.getSortBy("latest"))
            .isEqualTo("updatedAt");
    }

    @ParameterizedTest
    @NullAndEmptySource
    @DisplayName("빈 값을 넘기면 기본 정렬 기준을 반환한다.")
    void defaultSortBy(String input) {
        assertThat(ReviewSortType.getSortBy(input))
            .isEqualTo("updatedAt");
    }

    @Test
    @DisplayName("이상한 값을 넘겨도 기본 정렬 기준을 반환한다.")
    void wrongSortBy() {
        assertThat(ReviewSortType.getSortBy("my name is panda"))
            .isEqualTo("updatedAt");
    }
}
