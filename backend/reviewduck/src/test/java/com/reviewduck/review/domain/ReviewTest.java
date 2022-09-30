package com.reviewduck.review.domain;

import static org.assertj.core.api.Assertions.*;
import static org.junit.jupiter.api.Assertions.*;

import java.util.List;
import java.util.stream.Collectors;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.NullAndEmptySource;

import com.reviewduck.member.domain.Member;
import com.reviewduck.review.exception.ReviewException;
import com.reviewduck.review.service.ReviewFormQuestionCreateDto;

public class ReviewTest {

    private final Member member = new Member("1", "socialId", "nickname", "profileUrl");
    private final ReviewForm reviewForm = new ReviewForm(member, "title", List.of(
        new ReviewFormQuestionCreateDto("question1", "description1"),
        new ReviewFormQuestionCreateDto("question2", "description2"),
        new ReviewFormQuestionCreateDto("question3", "description3")));

    @Test
    @DisplayName("제약조건에 걸리지 않으면 회고가 생성된다.")
    void createReview() {
        //when, then
        assertDoesNotThrow(() -> new Review(
            "title",
            member,
            reviewForm,
            List.of(
                new QuestionAnswer(new ReviewFormQuestion("question1", "description1"), new Answer("answer1")),
                new QuestionAnswer(new ReviewFormQuestion("question2", "description2"), new Answer("answer2")),
                new QuestionAnswer(new ReviewFormQuestion("question3", "description3"), new Answer("answer3"))
            ),
            false));
    }

    @ParameterizedTest
    @NullAndEmptySource
    @DisplayName("회고 생성 시 제목이 비어있을 수 없다.")
    void createReview(String title) {
        //when, then
        assertThatThrownBy(() -> new Review(
            title,
            member,
            reviewForm,
            List.of(
                new QuestionAnswer(new ReviewFormQuestion("question1", "description1"), new Answer("answer1")),
                new QuestionAnswer(new ReviewFormQuestion("question2", "description2"), new Answer("answer2")),
                new QuestionAnswer(new ReviewFormQuestion("question3", "description3"), new Answer("answer3"))
            ),
            false))
            .isInstanceOf(ReviewException.class)
            .hasMessage("회고의 제목은 비어있을 수 없습니다.");
    }

    @Test
    @DisplayName("질문/답변의 순서값은 0부터 순서대로 부여된다.")
    void setPositionInOrder() {
        // when
        Review review = new Review(
            "title",
            member,
            reviewForm,
            List.of(
                new QuestionAnswer(new ReviewFormQuestion("question1", "description1"), new Answer("answer1")),
                new QuestionAnswer(new ReviewFormQuestion("question2", "description2"), new Answer("answer2")),
                new QuestionAnswer(new ReviewFormQuestion("question3", "description3"), new Answer("answer3"))
            ),
            false);

        List<Integer> actual = review.getQuestionAnswers().stream()
            .map(QuestionAnswer::getPosition)
            .collect(Collectors.toUnmodifiableList());

        List<Integer> expected = List.of(0, 1, 2);

        //then
        assertThat(actual).isEqualTo(expected);
    }

    @Test
    @DisplayName("좋아요를 추가한다.")
    void like() {
        // given
        Review review = new Review(
            "title",
            member,
            reviewForm,
            List.of(
                new QuestionAnswer(new ReviewFormQuestion("question1", "description1"), new Answer("answer1")),
                new QuestionAnswer(new ReviewFormQuestion("question2", "description2"), new Answer("answer2")),
                new QuestionAnswer(new ReviewFormQuestion("question3", "description3"), new Answer("answer3"))
            ), false);

        // when
        int likeCount = 50;
        // 50씩 두 번 업데이트
        review.like(likeCount);
        int actual = review.like(likeCount);

        // then
        assertThat(actual).isEqualTo(100);
    }
}
