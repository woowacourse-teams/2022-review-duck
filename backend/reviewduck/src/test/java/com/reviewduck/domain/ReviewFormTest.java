package com.reviewduck.domain;

import static org.assertj.core.api.Assertions.*;
import static org.junit.jupiter.api.Assertions.*;

import java.util.List;
import java.util.stream.Collectors;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.NullAndEmptySource;
import org.junit.jupiter.params.provider.NullSource;

import com.reviewduck.exception.ReviewFormException;

class ReviewFormTest {
    @Test
    @DisplayName("제약조건에 걸리지 않으면 회고 폼이 생성된다.")
    void createReviewForm() {
        //when, then
        assertDoesNotThrow(() -> new ReviewForm("리뷰폼 제목", List.of("질문1", "질문2")));
    }

    @ParameterizedTest
    @NullAndEmptySource
    @DisplayName("회고 폼 생성 시 타이틀이 비어있을 수 없다.")
    void notNullTitle(String reviewTitle) {
        //when, then
        assertThatThrownBy(() -> new ReviewForm(reviewTitle, List.of()))
            .isInstanceOf(ReviewFormException.class)
            .hasMessageContaining("회고 폼의 제목은 비어있을 수 없습니다.");
    }

    @Test
    @DisplayName("회고 폼 생성 시 타이틀의 길이는 100자 이하이어야 한다.")
    void titleProperLength() {
        //when, then
        assertDoesNotThrow(() -> new ReviewForm("a".repeat(100), List.of()));
    }

    @Test
    @DisplayName("회고 폼 생성 시 타이틀의 길이는 100자를 넘을 수 없다.")
    void titleOverLength() {
        //when, then
        assertThatThrownBy(() -> new ReviewForm("a".repeat(101), List.of()))
            .isInstanceOf(ReviewFormException.class)
            .hasMessageContaining("회고 폼의 제목은 100자를 넘을 수 없습니다.");
    }

    @ParameterizedTest
    @NullSource
    @DisplayName("회고 폼 생성 시 질문 목록은 비어있을 수 없다.")
    void notNullQuestions(List<String> questions) {
        //when, then
        assertThatThrownBy(() -> new ReviewForm("질문목록", questions))
            .isInstanceOf(ReviewFormException.class)
            .hasMessageContaining("회고 폼의 질문 목록 생성 중 오류가 발생했습니다.");
    }

    @Test
    @DisplayName("회고 폼 수정 시 타이틀의 길이는 100자 이하이어야 한다.")
    void updateTitleProperLength() {
        // given
        ReviewForm reviewForm = new ReviewForm("리뷰폼 제목", List.of("질문1", "질문2"));

        //when, then
        assertDoesNotThrow(() -> reviewForm.update("a".repeat(100), List.of(new ReviewFormQuestion("새로운질문1"))));
    }

    @Test
    @DisplayName("회고 폼 수정 시 타이틀의 길이는 100자를 넘을 수 없다.")
    void updateTitleOverLength() {
        // given
        ReviewForm reviewForm = new ReviewForm("리뷰폼 제목", List.of("질문1", "질문2"));

        //when, then
        assertThatThrownBy(() -> reviewForm.update("a".repeat(101), List.of(new ReviewFormQuestion("새로운질문1"))))
            .isInstanceOf(ReviewFormException.class)
            .hasMessageContaining("회고 폼의 제목은 100자를 넘을 수 없습니다.");
    }

    @Test
    @DisplayName("질문의 순서값은 0부터 순서대로 부여된다.")
    void setPositionInOrder() {
        //given
        ReviewForm reviewForm = new ReviewForm("리뷰폼 제목", List.of("질문1", "질문2", "질문3"));
        List<Integer> actual = reviewForm.getReviewFormQuestions().stream()
            .map(ReviewFormQuestion::getPosition)
            .collect(Collectors.toUnmodifiableList());
        List<Integer> expected = List.of(0, 1, 2);

        //when, then
        assertThat(actual).isEqualTo(expected);
    }
}
