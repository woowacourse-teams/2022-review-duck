package com.reviewduck.template.domain;

import static org.assertj.core.api.Assertions.*;
import static org.junit.jupiter.api.Assertions.*;

import java.util.List;
import java.util.stream.Collectors;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.NullAndEmptySource;
import org.junit.jupiter.params.provider.NullSource;

import com.reviewduck.member.domain.Member;
import com.reviewduck.template.exception.TemplateException;

class TemplateTest {

    private final Member member = new Member("1", "socialId", "nickname", "profileUrl");

    @Nested
    @DisplayName("템플릿 생성")
    class createTemplate {

        @Test
        @DisplayName("제약조건에 걸리지 않으면 템플릿이 생성된다.")
        void createTemplate() {
            //when, then
            assertDoesNotThrow(() -> new Template(member, "a".repeat(100), "템플릿 설명", List.of(
                new TemplateQuestion("질문1", "설명1"),
                new TemplateQuestion("질문2", "설명2"))));
        }

        @ParameterizedTest
        @NullAndEmptySource
        @DisplayName("타이틀이 비어있을 수 없다.")
        void notNullTitle(String templateTitle) {
            //when, then
            assertThatThrownBy(() -> new Template(member, templateTitle, "템플릿 설명", List.of()))
                .isInstanceOf(TemplateException.class)
                .hasMessageContaining("템플릿의 제목은 비어있을 수 없습니다.");
        }

        @Test
        @DisplayName("타이틀의 길이는 100자를 넘을 수 없다.")
        void titleOverLength() {
            //when, then
            assertThatThrownBy(() -> new Template(member, "a".repeat(101), "템플릿 설명", List.of()))
                .isInstanceOf(TemplateException.class)
                .hasMessageContaining("템플릿의 제목은 100자를 넘을 수 없습니다.");
        }

        @ParameterizedTest
        @NullSource
        @DisplayName("설명이 null 일 수 없다.")
        void notNullDescription(String templateDescription) {
            //when, then
            assertThatThrownBy(() -> new Template(member, "templateTitle", templateDescription, List.of()))
                .isInstanceOf(TemplateException.class)
                .hasMessageContaining("템플릿의 설명 작성 중 오류가 발생했습니다.");
        }

        @ParameterizedTest
        @NullSource
        @DisplayName("질문 목록은 비어있을 수 없다.")
        void notNullQuestions(List<TemplateQuestion> questions) {
            //when, then
            assertThatThrownBy(() -> new Template(member, "질문목록", "템플릿 설명", questions))
                .isInstanceOf(TemplateException.class)
                .hasMessageContaining("템플릿의 질문 목록 생성 중 오류가 발생했습니다.");
        }

        @Test
        @DisplayName("질문의 순서값은 0부터 순서대로 부여된다.")
        void setPositionInOrder() {
            //given
            Template template = new Template(member, "템플릿 제목", "템플릿 설명", List.of(
                new TemplateQuestion("질문1", "설명1"),
                new TemplateQuestion("질문2", "설명2"),
                new TemplateQuestion("질문3", "설명3")));
            List<Integer> actual = template.getQuestions().stream()
                .map(TemplateQuestion::getPosition)
                .collect(Collectors.toUnmodifiableList());
            List<Integer> expected = List.of(0, 1, 2);

            //when, then
            assertThat(actual).isEqualTo(expected);
        }

    }

}
