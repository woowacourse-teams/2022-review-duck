package com.reviewduck.review.domain;

import static org.assertj.core.api.Assertions.*;
import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.NullSource;

import com.reviewduck.review.exception.ReviewFormQuestionException;

public class ReviewFormQuestionTest {

    @ParameterizedTest
    @NullSource
    @DisplayName("질문 내용은 비어있을 수 없다.")
    void notBlankQuestionValue(String value) {
        //when, then
        assertThatThrownBy(() -> new ReviewFormQuestion(value))
            .isInstanceOf(ReviewFormQuestionException.class)
            .hasMessageContaining("질문 내용은 비어있을 수 없습니다.");
    }

    @Test
    @DisplayName("질문의 길이는 200자 이하이어야 한다.")
    void valueProperLength() {
        //when, then
        assertDoesNotThrow(() -> new ReviewFormQuestion("a".repeat(200)));
    }

    @Test
    @DisplayName("질문의 길이는 200자를 넘을 수 없다.")
    void valueOverLength() {
        //when, then
        assertThatThrownBy(() -> new ReviewFormQuestion("a".repeat(201)))
            .isInstanceOf(ReviewFormQuestionException.class)
            .hasMessageContaining("질문은 200자를 넘을 수 없습니다.");
    }

    @Test
    @DisplayName("질문의 위치 값은 음수가 될 수 없다.")
    void positionUnderZero() {
        //given
        ReviewFormQuestion reviewFormQuestion = new ReviewFormQuestion("a");

        //when, then
        assertThatThrownBy(() -> reviewFormQuestion.setPosition(-1))
            .isInstanceOf(ReviewFormQuestionException.class)
            .hasMessageContaining("질문 생성 중 에러가 발생하였습니다.");
    }
}
