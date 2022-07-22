package com.reviewduck.repository;

import static org.assertj.core.api.Assertions.*;
import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import com.reviewduck.domain.ReviewFormQuestion;

@DataJpaTest
public class ReviewFormQuestionRepositoryTest {

    @Autowired
    private QuestionRepository questionRepository;

    @Test
    @DisplayName("질문을 저장한다.")
    void saveQuestion() {
        // given
        ReviewFormQuestion reviewFormQuestion = new ReviewFormQuestion("new question");

        // when
        ReviewFormQuestion savedReviewFormQuestion = questionRepository.save(reviewFormQuestion);

        // then
        assertAll(
            () -> assertThat(savedReviewFormQuestion.getValue()).isEqualTo(reviewFormQuestion.getValue()),
            () -> assertThat(savedReviewFormQuestion.getId()).isNotNull()
        );
    }
}
