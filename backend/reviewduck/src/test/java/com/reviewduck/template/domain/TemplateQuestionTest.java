package com.reviewduck.template.domain;

import static org.assertj.core.api.Assertions.*;
import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.NullSource;

import com.reviewduck.template.exception.TemplateQuestionException;

public class TemplateQuestionTest {

    @ParameterizedTest
    @NullSource
    @DisplayName("질문 내용은 비어있을 수 없다.")
    void notBlankQuestionValue(String value) {
        //when, then
        assertThatThrownBy(() -> new TemplateQuestion(value))
            .isInstanceOf(TemplateQuestionException.class)
            .hasMessageContaining("질문 내용은 비어있을 수 없습니다.");
    }

    @Test
    @DisplayName("질문의 길이는 200자 이하이어야 한다.")
    void valueProperLength() {
        //when, then
        assertDoesNotThrow(() -> new TemplateQuestion("a".repeat(200)));
    }

    @Test
    @DisplayName("질문의 길이는 200자를 넘을 수 없다.")
    void valueOverLength() {
        //when, then
        assertThatThrownBy(() -> new TemplateQuestion("a".repeat(201)))
            .isInstanceOf(TemplateQuestionException.class)
            .hasMessageContaining("질문은 200자를 넘을 수 없습니다.");
    }

    @Test
    @DisplayName("질문의 위치 값은 음수가 될 수 없다.")
    void positionUnderZero() {
        //given
        TemplateQuestion templateQuestion = new TemplateQuestion("a");

        //when, then
        assertThatThrownBy(() -> templateQuestion.setPosition(-1))
            .isInstanceOf(TemplateQuestionException.class)
            .hasMessageContaining("질문 생성 중 에러가 발생하였습니다.");
    }
}
