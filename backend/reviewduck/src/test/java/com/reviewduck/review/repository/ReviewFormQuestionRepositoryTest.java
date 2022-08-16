package com.reviewduck.review.repository;

import static org.assertj.core.api.Assertions.*;
import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.context.annotation.Import;

import com.reviewduck.config.JpaAuditingConfig;
import com.reviewduck.review.domain.ReviewFormQuestion;

@DataJpaTest
@Import(JpaAuditingConfig.class)
public class ReviewFormQuestionRepositoryTest {

    @Autowired
    private ReviewFormQuestionRepository reviewFormQuestionRepository;

    @Test
    @DisplayName("질문을 저장한다.")
    void saveQuestion() {
        // given
        ReviewFormQuestion reviewFormQuestion = new ReviewFormQuestion("new question","description");

        // when
        ReviewFormQuestion savedReviewFormQuestion = reviewFormQuestionRepository.save(reviewFormQuestion);

        // then
        assertAll(
            () -> assertThat(savedReviewFormQuestion.getValue()).isEqualTo(reviewFormQuestion.getValue()),
            () -> assertThat(savedReviewFormQuestion.getId()).isNotNull()
        );
    }
}
