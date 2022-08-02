package com.reviewduck.review.domain;

import static org.assertj.core.api.Assertions.*;
import static org.junit.jupiter.api.Assertions.*;

import java.util.List;
import java.util.stream.Collectors;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import com.reviewduck.member.domain.Member;

public class ReviewTest {
    @Test
    @DisplayName("제약조건에 걸리지 않으면 회고가 생성된다.")
    void createReview() {
        //given
        Member member = new Member("1","socialId", "nickname", "pofileUrl");
        ReviewForm reviewForm = new ReviewForm(member, "title", List.of("question1"));

        //when, then
        assertDoesNotThrow(() -> new Review(
            member,
            reviewForm,
            List.of(new QuestionAnswer(new ReviewFormQuestion("question1"), new Answer("answer1")))));
    }

    @Test
    @DisplayName("질문/답변의 순서값은 0부터 순서대로 부여된다.")
    void setPositionInOrder() {
        //given
        Member member = new Member("1","socialId", "nickname", "pofileUrl");
        ReviewForm reviewForm = new ReviewForm(member, "title", List.of("question1", "question2", "question3"));

        // when
        Review review = new Review(
            member,
            reviewForm,
            List.of(
                new QuestionAnswer(new ReviewFormQuestion("question1"), new Answer("answer1")),
                new QuestionAnswer(new ReviewFormQuestion("question2"), new Answer("answer2")),
                new QuestionAnswer(new ReviewFormQuestion("question3"), new Answer("answer3"))
            ));

        List<Integer> actual = review.getQuestionAnswers().stream()
            .map(QuestionAnswer::getPosition)
            .collect(Collectors.toUnmodifiableList());

        List<Integer> expected = List.of(0, 1, 2);

        //then
        assertThat(actual).isEqualTo(expected);
    }
}
