package com.reviewduck.domain;

import static org.assertj.core.api.Assertions.*;
import static org.junit.jupiter.api.Assertions.*;

import java.util.List;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.NullAndEmptySource;

import com.reviewduck.exception.ReviewException;

public class ReviewTest {
    @Test
    @DisplayName("제약조건에 걸리지 않으면 회고가 생성된다.")
    void createReview() {
        //when, then
        assertDoesNotThrow(() -> Review.of("제이슨",
            new ReviewForm("title", List.of("question1")),
            List.of(new QuestionAnswer(new Question("question1"), new Answer("answer1")))));
    }

    @ParameterizedTest
    @NullAndEmptySource
    @DisplayName("닉네임이 비어있을 수 없다.")
    void notNullNickname(String nickname) {
        //when, then
        assertThatThrownBy(() -> Review.of(nickname,
            new ReviewForm("title", List.of("question1")),
            List.of(new QuestionAnswer(new Question("question1"), new Answer("answer1")))))
            .isInstanceOf(ReviewException.class)
            .hasMessageContaining("닉네임이 비어있을 수 없습니다.");
    }
}
