package com.reviewduck.template.domain;

import static org.assertj.core.api.Assertions.*;
import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.EmptySource;
import org.junit.jupiter.params.provider.NullSource;

import com.reviewduck.template.exception.TemplateQuestionException;

public class TemplateQuestionTest {

    @Nested
    @DisplayName("회고 폼 질문 생성")
    class createTemplateQuestion {

        @Test
        @DisplayName("입력값이 올바른 경우 객체가 생성된다.")
        void createTemplateQuestion() {
            // when, then
            assertDoesNotThrow(
                () -> new TemplateQuestion("a".repeat(200), "a".repeat(200))
            );
        }

        @ParameterizedTest
        @EmptySource
        @DisplayName("질문은 비어있을 수 없다.")
        void notEmptyQuestionValue(String value) {
            //when, then
            assertThatThrownBy(() -> new TemplateQuestion(value, ""))
                .isInstanceOf(TemplateQuestionException.class)
                .hasMessageContaining("질문 내용은 비어있을 수 없습니다.");
        }

        @ParameterizedTest
        @EmptySource
        @DisplayName("질문의 길이는 1 이상이어야 한다.")
        void notBlankQuestionValue(String value) {
            //when, then
            assertThatThrownBy(() -> new TemplateQuestion(value, ""))
                .isInstanceOf(TemplateQuestionException.class)
                .hasMessageContaining("질문 내용은 비어있을 수 없습니다.");
        }

        @Test
        @DisplayName("질문의 길이는 200자를 넘을 수 없다.")
        void valueOverLength() {
            //when, then
            assertThatThrownBy(() -> new TemplateQuestion("a".repeat(201), ""))
                .isInstanceOf(TemplateQuestionException.class)
                .hasMessageContaining("질문은 200자를 넘을 수 없습니다.");
        }

        @ParameterizedTest
        @NullSource
        @DisplayName("질문의 설명은 비어있을 수 없다.")
        void notBlankQuestionDescription(String description) {
            //when, then
            assertThatThrownBy(() -> new TemplateQuestion("value", description))
                .isInstanceOf(TemplateQuestionException.class)
                .hasMessageContaining("질문 생성 중 에러가 발생하였습니다.");
        }

        @Test
        @DisplayName("질문의 설명은 200자를 넘을 수 없다.")
        void descriptionOverLength() {
            //when, then
            assertThatThrownBy(() -> new TemplateQuestion("value", "a".repeat(201)))
                .isInstanceOf(TemplateQuestionException.class)
                .hasMessageContaining("질문은 200자를 넘을 수 없습니다.");
        }

    }

    @Nested
    @DisplayName("회고 폼 질문 수정")
    class updateTemplateQuestion {

        @Test
        @DisplayName("입력값이 올바른 경우 객체가 수정된다.")
        void createTemplateQuestion() {
            // given
            TemplateQuestion question = new TemplateQuestion("value", "description");

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
            TemplateQuestion question = new TemplateQuestion("value", "description");

            //when, then
            assertThatThrownBy(() -> question.update(value, "description1"))
                .isInstanceOf(TemplateQuestionException.class)
                .hasMessageContaining("질문 내용은 비어있을 수 없습니다.");
        }

        @ParameterizedTest
        @EmptySource
        @DisplayName("질문의 길이는 1 이상이어야 한다.")
        void notBlankQuestionValue(String value) {
            // given
            TemplateQuestion question = new TemplateQuestion("value", "description");

            //when, then
            assertThatThrownBy(() -> question.update(value, ""))
                .isInstanceOf(TemplateQuestionException.class)
                .hasMessageContaining("질문 내용은 비어있을 수 없습니다.");
        }

        @Test
        @DisplayName("질문의 길이는 200자를 넘을 수 없다.")
        void valueOverLength() {
            // given
            TemplateQuestion question = new TemplateQuestion("value", "description");

            //when, then
            assertThatThrownBy(() -> question.update("a".repeat(201), ""))
                .isInstanceOf(TemplateQuestionException.class)
                .hasMessageContaining("질문은 200자를 넘을 수 없습니다.");
        }

        @ParameterizedTest
        @NullSource
        @DisplayName("질문의 설명은 비어있을 수 없다.")
        void notBlankQuestionDescription(String description) {
            // given
            TemplateQuestion question = new TemplateQuestion("value", "description");

            //when, then
            assertThatThrownBy(() -> question.update("value", description))
                .isInstanceOf(TemplateQuestionException.class)
                .hasMessageContaining("질문 생성 중 에러가 발생하였습니다.");
        }

        @Test
        @DisplayName("질문의 설명은 200자를 넘을 수 없다.")
        void descriptionOverLength() {
            // given
            TemplateQuestion question = new TemplateQuestion("value", "description");

            //when, then
            assertThatThrownBy(() -> question.update("value", "a".repeat(201)))
                .isInstanceOf(TemplateQuestionException.class)
                .hasMessageContaining("질문은 200자를 넘을 수 없습니다.");
        }

    }

    @Test
    @DisplayName("질문의 위치 값은 음수가 될 수 없다.")
    void positionUnderZero() {
        //given
        TemplateQuestion templateQuestion = new TemplateQuestion("a", "");

        //when, then
        assertThatThrownBy(() -> templateQuestion.setPosition(-1))
            .isInstanceOf(TemplateQuestionException.class)
            .hasMessageContaining("질문 생성 중 에러가 발생하였습니다.");
    }
}
