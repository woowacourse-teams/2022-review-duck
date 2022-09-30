package com.reviewduck.template.domain;

import static org.assertj.core.api.Assertions.*;

import java.util.List;
import java.util.stream.Collectors;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.NullAndEmptySource;
import org.junit.jupiter.params.provider.NullSource;

import com.reviewduck.member.domain.Member;
import com.reviewduck.template.dto.service.TemplateQuestionCreateDto;
import com.reviewduck.template.dto.service.TemplateQuestionUpdateDto;
import com.reviewduck.template.exception.TemplateException;

class TemplateTest {

    private final Member member = new Member("1", "socialId", "nickname", "profileUrl");

    @Nested
    @DisplayName("템플릿 생성")
    class createTemplate {

        private final List<TemplateQuestionCreateDto> questions = List.of(
            new TemplateQuestionCreateDto("질문1", "설명1"),
            new TemplateQuestionCreateDto("질문2", "설명2"),
            new TemplateQuestionCreateDto("질문3", "설명3"));

        @Test
        @DisplayName("제약조건에 걸리지 않으면 템플릿이 생성된다.")
        void createTemplate() {
            //given
            Template template = new Template(member, "템플릿 제목", "템플릿 설명", questions);

            List<TemplateQuestion> actual = template.getQuestions();

            //when, then
            assertThat(actual).usingRecursiveComparison()
                .ignoringFields("id", "template")
                .isEqualTo(toEntity(questions));
        }

        @ParameterizedTest
        @NullAndEmptySource
        @DisplayName("타이틀이 비어있을 수 없다.")
        void notNullTitle(String templateTitle) {
            //when, then
            assertThatThrownBy(() -> new Template(member, templateTitle, "템플릿 설명", questions))
                .isInstanceOf(TemplateException.class)
                .hasMessageContaining("템플릿의 제목은 비어있을 수 없습니다.");
        }

        @Test
        @DisplayName("타이틀의 길이는 100자를 넘을 수 없다.")
        void titleOverLength() {
            //when, then
            assertThatThrownBy(() -> new Template(member, "a".repeat(101), "템플릿 설명", questions))
                .isInstanceOf(TemplateException.class)
                .hasMessageContaining("템플릿의 제목은 100자를 넘을 수 없습니다.");
        }

        @ParameterizedTest
        @NullSource
        @DisplayName("설명이 null 일 수 없다.")
        void notNullDescription(String templateDescription) {
            //when, then
            assertThatThrownBy(() -> new Template(member, "templateTitle", templateDescription, questions))
                .isInstanceOf(TemplateException.class)
                .hasMessageContaining("템플릿의 설명 작성 중 오류가 발생했습니다.");
        }

        @ParameterizedTest
        @NullSource
        @DisplayName("잘문 목록이 null 일 수 없다.")
        void notNullQuestions(List<TemplateQuestionCreateDto> questions) {
            //when, then
            assertThatThrownBy(() -> new Template(member, "템플릿 제목", "템플릿 설명", questions))
                .isInstanceOf(TemplateException.class)
                .hasMessageContaining("템플릿의 질문 작성 중 오류가 발생했습니다.");
        }

        private List<TemplateQuestion> toEntity(List<TemplateQuestionCreateDto> dtos) {
            List<TemplateQuestion> questions = dtos.stream()
                .map(dto -> new TemplateQuestion(dto.getValue(), dto.getDescription()))
                .collect(Collectors.toUnmodifiableList());

            int position = 0;
            for (TemplateQuestion question : questions) {
                question.setPosition(position++);
            }

            return questions;
        }
    }

    @Nested
    @DisplayName("템플릿 수정")
    class updateTemplate {

        private final List<TemplateQuestionCreateDto> createQuestions = List.of(
            new TemplateQuestionCreateDto("질문1", "설명1"),
            new TemplateQuestionCreateDto("질문2", "설명2")
        );

        private final List<TemplateQuestionUpdateDto> updateQuestions = List.of(
            new TemplateQuestionUpdateDto(1L, "수정된_질문1", "수정된_설명1"),
            new TemplateQuestionUpdateDto(3L, "수정된_질문3", "수정된_설명3"),
            new TemplateQuestionUpdateDto(null, "질문4", "설명4")
        );

        @Test
        @DisplayName("제약조건에 걸리지 않으면 템플릿이 수정된다.")
        void updateTemplate() {
            //given
            Template template = new Template(member, "템플릿 제목", "템플릿 설명", createQuestions);
            String updatedTitle = "수정된 템플릿 제목";
            String updatedDescription = "수정된 템플릿 설명";

            // when
            template.update(updatedTitle, updatedDescription, updateQuestions);

            // then
            assertThat(template.getQuestions()).usingRecursiveComparison()
                .ignoringFields("id", "template")
                .isEqualTo(toEntity(updateQuestions));
        }

        @ParameterizedTest
        @NullAndEmptySource
        @DisplayName("타이틀이 비어있을 수 없다.")
        void notNullTitle(String templateTitle) {
            //when, then
            assertThatThrownBy(() -> createTemplate().update(templateTitle, "템플릿 설명", updateQuestions))
                .isInstanceOf(TemplateException.class)
                .hasMessageContaining("템플릿의 제목은 비어있을 수 없습니다.");
        }

        @Test
        @DisplayName("타이틀의 길이는 100자를 넘을 수 없다.")
        void titleOverLength() {
            //when, then
            assertThatThrownBy(() -> createTemplate().update("a".repeat(101), "템플릿 설명", updateQuestions))
                .isInstanceOf(TemplateException.class)
                .hasMessageContaining("템플릿의 제목은 100자를 넘을 수 없습니다.");
        }

        @ParameterizedTest
        @NullSource
        @DisplayName("설명이 null 일 수 없다.")
        void notNullDescription(String templateDescription) {
            //when, then
            assertThatThrownBy(() -> createTemplate().update("템플릿 제목", templateDescription, updateQuestions))
                .isInstanceOf(TemplateException.class)
                .hasMessageContaining("템플릿의 설명 작성 중 오류가 발생했습니다.");
        }

        @ParameterizedTest
        @NullSource
        @DisplayName("잘문 목록이 null 일 수 없다.")
        void notNullQuestions(List<TemplateQuestionUpdateDto> questions) {
            //when, then
            assertThatThrownBy(() -> createTemplate().update("템플릿 제목", "템플릿 설명", questions))
                .isInstanceOf(TemplateException.class)
                .hasMessageContaining("템플릿의 질문 작성 중 오류가 발생했습니다.");
        }

        private List<TemplateQuestion> toEntity(List<TemplateQuestionUpdateDto> dtos) {
            List<TemplateQuestion> questions = dtos.stream()
                .map(dto -> new TemplateQuestion(dto.getValue(), dto.getDescription()))
                .collect(Collectors.toUnmodifiableList());

            int position = 0;
            for (TemplateQuestion question : questions) {
                question.setPosition(position++);
            }

            return questions;
        }

        private Template createTemplate() {
            return new Template(member, "템플릿 제목", "템플릿 설명", createQuestions);
        }

    }
}
