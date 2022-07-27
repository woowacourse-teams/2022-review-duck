package com.reviewduck.review.domain;

import static org.assertj.core.api.Assertions.*;
import static org.junit.jupiter.api.Assertions.*;

import java.util.List;
import java.util.stream.Collectors;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.NullAndEmptySource;

import com.reviewduck.review.exception.ReviewException;

public class ReviewTest {
    @Test
    @DisplayName("제약조건에 걸리지 않으면 회고가 생성된다.")
    void createReview() {
        //when, then
        assertDoesNotThrow(() -> Review.of("제이슨",
            new ReviewForm("title", List.of("question1")),
            List.of(new QuestionAnswer(new ReviewFormQuestion("question1"), new Answer("answer1")))));
    }

    @ParameterizedTest
    @NullAndEmptySource
    @DisplayName("닉네임이 비어있을 수 없다.")
    void notNullNickname(String nickname) {
        //when, then
        assertThatThrownBy(() -> Review.of(nickname,
            new ReviewForm("title", List.of("question1")),
            List.of(new QuestionAnswer(new ReviewFormQuestion("question1"), new Answer("answer1")))))
            .isInstanceOf(ReviewException.class)
            .hasMessageContaining("닉네임이 비어있을 수 없습니다.");
    }

    @Test
    @DisplayName("질문/답변의 순서값은 0부터 순서대로 부여된다.")
    void setPositionInOrder() {
        //given
        ReviewForm reviewForm = new ReviewForm("리뷰폼 제목", List.of("질문1", "질문2", "질문3"));
        Review review = Review.of("제이슨", reviewForm,
            List.of(
                new QuestionAnswer(new ReviewFormQuestion("질문1"), new Answer("answer1")),
                new QuestionAnswer(new ReviewFormQuestion("질문2"), new Answer("answer2")),
                new QuestionAnswer(new ReviewFormQuestion("질문3"), new Answer("answer3"))
            ));

        List<Integer> actual = review.getQuestionAnswers().stream()
            .map(QuestionAnswer::getPosition)
            .collect(Collectors.toUnmodifiableList());

        List<Integer> expected = List.of(0, 1, 2);

        //when, then
        assertThat(actual).isEqualTo(expected);
    }
}
