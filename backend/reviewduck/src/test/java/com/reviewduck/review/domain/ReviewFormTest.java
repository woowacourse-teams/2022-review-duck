package com.reviewduck.review.domain;

import static org.assertj.core.api.Assertions.*;
import static org.junit.jupiter.api.Assertions.*;

import java.util.List;
import java.util.stream.Collectors;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.junit.jupiter.params.provider.NullAndEmptySource;
import org.junit.jupiter.params.provider.NullSource;

import com.reviewduck.common.exception.NotFoundException;
import com.reviewduck.member.domain.Member;
import com.reviewduck.review.dto.service.ReviewFormQuestionCreateDto;
import com.reviewduck.review.dto.service.ReviewFormQuestionUpdateDto;
import com.reviewduck.review.exception.ReviewFormException;

class ReviewFormTest {

    private final Member member = new Member(1L, "1", "socialId", "nickname", "profileUrl");

    @Nested
    @DisplayName("회고 폼 생성")
    class createReviewForm {

        private final List<ReviewFormQuestionCreateDto> questions = List.of(
            new ReviewFormQuestionCreateDto("question1", "description1"),
            new ReviewFormQuestionCreateDto("question2", "description2"),
            new ReviewFormQuestionCreateDto("question3", "description3"));

        @Test
        @DisplayName("제약조건에 걸리지 않으면 회고 폼이 생성된다.")
        void createReviewForm() {
            //given
            ReviewForm reviewForm = new ReviewForm(member, "a".repeat(100), questions);

            List<ReviewFormQuestion> actual = reviewForm.getQuestions();

            //when, then
            assertThat(actual).usingRecursiveComparison()
                .ignoringFields("id", "reviewForm")
                .isEqualTo(toEntity(questions, reviewForm));
        }

        @ParameterizedTest
        @NullAndEmptySource
        @DisplayName("제목은 비어있을 수 없다.")
        void notNullTitle(String reviewTitle) {
            //when, then
            assertThatThrownBy(() -> new ReviewForm(member, reviewTitle, List.of()))
                .isInstanceOf(ReviewFormException.class)
                .hasMessageContaining("회고 폼의 제목은 비어있을 수 없습니다.");
        }

        @Test
        @DisplayName("제목의 길이는 100자를 넘을 수 없다.")
        void titleOverLength() {
            //when, then
            assertThatThrownBy(() -> new ReviewForm(member, "a".repeat(101), List.of()))
                .isInstanceOf(ReviewFormException.class)
                .hasMessageContaining("회고 폼의 제목은 100자를 넘을 수 없습니다.");
        }

        @ParameterizedTest
        @NullSource
        @DisplayName("질문 목록은 비어있을 수 없다.")
        void notNullQuestions(List<ReviewFormQuestionCreateDto> questions) {
            //when, then
            assertThatThrownBy(() -> new ReviewForm(member, "title", questions))
                .isInstanceOf(ReviewFormException.class)
                .hasMessageContaining("회고 폼의 질문 목록 생성 중 오류가 발생했습니다.");
        }

        @Test
        @DisplayName("질문의 순서값은 0부터 순서대로 부여된다.")
        void setPositionInOrder() {
            // given
            ReviewForm reviewForm = new ReviewForm(member, "리뷰폼 제목", questions);

            List<Integer> actual = reviewForm.getQuestions().stream()
                .map(ReviewFormQuestion::getPosition)
                .collect(Collectors.toUnmodifiableList());
            List<Integer> expected = List.of(0, 1, 2);

            //when, then
            assertThat(actual).isEqualTo(expected);
        }

        @ParameterizedTest
        @DisplayName("회고 질문지를 생성한 회원인지 검증한다.")
        @CsvSource(value = {"1:true", "2:false"}, delimiter = ':')
        void isSameId(long memberId, boolean expected) {
            // given
            ReviewForm reviewForm = new ReviewForm(member, "리뷰폼 제목", questions);

            // when, then
            assertThat(reviewForm.isMine(memberId)).isEqualTo(expected);
        }

        private List<ReviewFormQuestion> toEntity(final List<ReviewFormQuestionCreateDto> dtos, ReviewForm reviewForm) {
            List<ReviewFormQuestion> questions = dtos.stream()
                .map(dto -> new ReviewFormQuestion(dto.getValue(), dto.getDescription(), reviewForm))
                .collect(Collectors.toUnmodifiableList());

            int position = 0;
            for (ReviewFormQuestion question : questions) {
                question.setPosition(position++);
            }

            return questions;
        }

    }

    @Nested
    @DisplayName("회고 폼 수정")
    class updateReviewForm {

        private final List<ReviewFormQuestionUpdateDto> questions = List.of(
            new ReviewFormQuestionUpdateDto(null, "question1", "description1"),
            new ReviewFormQuestionUpdateDto(null, "question2", "description2"),
            new ReviewFormQuestionUpdateDto(null, "question3", "description3"));

        @Test
        @DisplayName("제약조건에 걸리지 않는다면 회고 폼의 제목이 수정된다.")
        void updateReviewForm() {
            // given
            ReviewForm reviewForm = new ReviewForm(member, "리뷰폼 제목", List.of());

            //when, then
            assertDoesNotThrow(
                () -> reviewForm.update("a".repeat(100), questions));

        }

        @ParameterizedTest
        @NullAndEmptySource
        @DisplayName("제목은 비어있을 수 없다.")
        void notNullTitle(String reviewTitle) {
            // given
            ReviewForm reviewForm = new ReviewForm(member, "리뷰폼 제목", List.of());

            //when, then
            assertThatThrownBy(() -> reviewForm.update(reviewTitle, List.of()))
                .isInstanceOf(ReviewFormException.class)
                .hasMessageContaining("회고 폼의 제목은 비어있을 수 없습니다.");
        }

        @Test
        @DisplayName("제목의 길이는 100자를 넘을 수 없다.")
        void titleOverLength() {
            // given
            ReviewForm reviewForm = new ReviewForm(member, "리뷰폼 제목", List.of());

            //when, then
            assertThatThrownBy(() -> reviewForm.update("a".repeat(101), List.of()))
                .isInstanceOf(ReviewFormException.class)
                .hasMessageContaining("회고 폼의 제목은 100자를 넘을 수 없습니다.");
        }

        @ParameterizedTest
        @NullSource
        @DisplayName("질문 목록은 비어있을 수 없다.")
        void notNullQuestions(List<ReviewFormQuestionUpdateDto> questions) {
            // given
            ReviewForm reviewForm = new ReviewForm(member, "리뷰폼 제목", List.of());

            //when, then
            assertThatThrownBy(() -> reviewForm.update("title", questions))
                .isInstanceOf(ReviewFormException.class)
                .hasMessageContaining("회고 폼의 질문 목록 생성 중 오류가 발생했습니다.");
        }

        @Test
        @DisplayName("새로운 질문 id에 해당하는 기존 질문 id가 없으면 예외를 반환한다.")
        void notExistsQuestion() {
            // given
            List<ReviewFormQuestionCreateDto> questions = List.of(
                new ReviewFormQuestionCreateDto("question1", "description1"),
                new ReviewFormQuestionCreateDto("question2", "description2"));

            String reviewTitle = "리뷰폼 제목";
            ReviewForm reviewForm = new ReviewForm(member, reviewTitle, questions);

            List<ReviewFormQuestionUpdateDto> questionsToUpdate = List.of(
                new ReviewFormQuestionUpdateDto(1L, "question1", "description1"),
                new ReviewFormQuestionUpdateDto(9999L, "question2", "description2"));

            // when, then
            assertThatThrownBy(() -> reviewForm.update(reviewTitle, questionsToUpdate))
                .isInstanceOf(NotFoundException.class)
                .hasMessageContaining("존재하지 않는 질문입니다.");
        }

    }
}
