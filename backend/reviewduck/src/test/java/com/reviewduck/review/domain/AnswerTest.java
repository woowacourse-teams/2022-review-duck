package com.reviewduck.review.domain;

import static org.assertj.core.api.Assertions.*;
import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.NullSource;

import com.reviewduck.review.domain.Answer;
import com.reviewduck.review.exception.AnswerException;

public class AnswerTest {

    @Test
    @DisplayName("제약조건을 만족하면 답변이 정상적으로 생성된다.")
    void properAnswerValue() {
        //when, then
        assertDoesNotThrow(() -> new Answer("a"));
    }

    @ParameterizedTest
    @NullSource
    @DisplayName("답변 내용은 비어있을 수 없다.")
    void notNullAnswerValue(String value) {
        //when, then
        assertThatThrownBy(() -> new Answer(value))
            .isInstanceOf(AnswerException.class)
            .hasMessageContaining("답변 작성 중 오류가 발생했습니다.");
    }
}
