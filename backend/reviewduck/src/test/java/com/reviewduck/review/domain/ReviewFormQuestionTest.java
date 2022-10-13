package com.reviewduck.review.domain;

import static org.assertj.core.api.Assertions.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.List;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.EmptySource;
import org.junit.jupiter.params.provider.NullSource;

import com.reviewduck.member.domain.Member;
import com.reviewduck.review.exception.ReviewFormQuestionException;

public class ReviewFormQuestionTest {

    private final ReviewForm reviewForm = mock(ReviewForm.class);

    @Nested
    @DisplayName("회고 폼 질문 생성")
    class createReviewFormQuestion {

        @Test
        @DisplayName("입력값이 올바른 경우 객체가 생성된다.")
        void createReviewFormQuestion() {
            // when, then
            assertDoesNotThrow(
                () -> new ReviewFormQuestion("a".repeat(200), "a".repeat(200), reviewForm)
            );
        }

        @ParameterizedTest
        @EmptySource
        @DisplayName("질문은 비어있을 수 없다.")
        void notEmptyQuestionValue(String value) {
            //when, then
            assertThatThrownBy(() -> new ReviewFormQuestion(value, "", reviewForm))
                .isInstanceOf(ReviewFormQuestionException.class)
                .hasMessageContaining("질문 내용은 비어있을 수 없습니다.");
        }

        @ParameterizedTest
        @EmptySource
        @DisplayName("질문의 길이는 1 이상이어야 한다.")
        void notBlankQuestionValue(String value) {
            //when, then
            assertThatThrownBy(() -> new ReviewFormQuestion(value, "", reviewForm))
                .isInstanceOf(ReviewFormQuestionException.class)
                .hasMessageContaining("질문 내용은 비어있을 수 없습니다.");
        }

        @Test
        @DisplayName("질문의 길이는 200자를 넘을 수 없다.")
        void valueOverLength() {
            //when, then
            assertThatThrownBy(() -> new ReviewFormQuestion("a".repeat(201), "", reviewForm))
                .isInstanceOf(ReviewFormQuestionException.class)
                .hasMessageContaining("질문은 200자를 넘을 수 없습니다.");
        }

        @ParameterizedTest
        @NullSource
        @DisplayName("질문의 설명은 비어있을 수 없다.")
        void notBlankQuestionDescription(String description) {
            //when, then
            assertThatThrownBy(() -> new ReviewFormQuestion("value", description, reviewForm))
                .isInstanceOf(ReviewFormQuestionException.class)
                .hasMessageContaining("질문 생성 중 에러가 발생하였습니다.");
        }

    }

    @Nested
    @DisplayName("회고 폼 질문 수정")
    class updateReviewFormQuestion {

        @Test
        @DisplayName("입력값이 올바른 경우 객체가 수정된다.")
        void createReviewFormQuestion() {
            // given
            ReviewFormQuestion question = new ReviewFormQuestion("value", "description", reviewForm);

            // when, then
            assertDoesNotThrow(
                () -> question.update("value2", "description2")
            );
        }

        @ParameterizedTest
        @EmptySource
        @DisplayName("질문은 비어있을 수 없다.")
        void notEmptyQuestionValue(String value) {
            // given
            ReviewFormQuestion question = new ReviewFormQuestion("value", "description", reviewForm);

            //when, then
            assertThatThrownBy(() -> question.update(value, "description1"))
                .isInstanceOf(ReviewFormQuestionException.class)
                .hasMessageContaining("질문 내용은 비어있을 수 없습니다.");
        }

        @ParameterizedTest
        @EmptySource
        @DisplayName("질문의 길이는 1 이상이어야 한다.")
        void notBlankQuestionValue(String value) {
            // given
            ReviewFormQuestion question = new ReviewFormQuestion("value", "description", reviewForm);

            //when, then
            assertThatThrownBy(() -> question.update(value, ""))
                .isInstanceOf(ReviewFormQuestionException.class)
                .hasMessageContaining("질문 내용은 비어있을 수 없습니다.");
        }

        @Test
        @DisplayName("질문의 길이는 200자를 넘을 수 없다.")
        void valueOverLength() {
            // given
            ReviewFormQuestion question = new ReviewFormQuestion("value", "description", reviewForm);

            //when, then
            assertThatThrownBy(() -> question.update("a".repeat(201), ""))
                .isInstanceOf(ReviewFormQuestionException.class)
                .hasMessageContaining("질문은 200자를 넘을 수 없습니다.");
        }

        @ParameterizedTest
        @NullSource
        @DisplayName("질문의 설명은 비어있을 수 없다.")
        void notBlankQuestionDescription(String description) {
            // given
            ReviewFormQuestion question = new ReviewFormQuestion("value", "description", reviewForm);

            //when, then
            assertThatThrownBy(() -> question.update("value", description))
                .isInstanceOf(ReviewFormQuestionException.class)
                .hasMessageContaining("질문 생성 중 에러가 발생하였습니다.");
        }

    }

    @Test
    @DisplayName("질문의 위치 값은 음수가 될 수 없다.")
    void positionUnderZero() {
        //given
        ReviewFormQuestion reviewFormQuestion = new ReviewFormQuestion("a", "", reviewForm);

        //when, then
        assertThatThrownBy(() -> reviewFormQuestion.setPosition(-1))
            .isInstanceOf(ReviewFormQuestionException.class)
            .hasMessageContaining("질문 생성 중 에러가 발생하였습니다.");
    }
}
