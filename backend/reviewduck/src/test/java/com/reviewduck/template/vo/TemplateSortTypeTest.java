package com.reviewduck.template.vo;

import static org.assertj.core.api.Assertions.*;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.junit.jupiter.params.provider.NullAndEmptySource;

class TemplateSortTypeTest {

    @ParameterizedTest
    @CsvSource(value = {"latest:createdAt", "trend:usedCount"}, delimiter = ':')
    @DisplayName("파라미터에 맞는 정렬 기준을 반환한다.")
    void getSortBy(String param, String sortBy) {
        assertThat(TemplateSortType.getSortBy(param))
            .isEqualTo(sortBy);
    }

    @ParameterizedTest
    @NullAndEmptySource
    @DisplayName("빈 값을 넘기면 기본 정렬 기준을 반환한다.")
    void defaultSortBy(String input) {
        assertThat(TemplateSortType.getSortBy(input))
            .isEqualTo("usedCount");
    }

    @Test
    @DisplayName("이상한 값을 넘겨도 기본 정렬 기준을 반환한다.")
    void wrongSortBy() {
        assertThat(TemplateSortType.getSortBy("my name is panda"))
            .isEqualTo("usedCount");
    }

}
