package com.reviewduck.repository;

import static org.assertj.core.api.Assertions.*;
import static org.junit.jupiter.api.Assertions.*;

import java.util.List;
import java.util.stream.Collectors;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import com.reviewduck.domain.Question;
import com.reviewduck.domain.ReviewForm;

@DataJpaTest
public class ReviewFormRepositoryTest {

    @Autowired
    private ReviewFormRepository reviewFormRepository;

    @Test
    @DisplayName("리뷰 폼을 저장한다.")
    void saveReviewForm() {
        // given
        List<String> questionValues = List.of("question1", "question2");
        List<Question> questions = questionValues.stream()
            .map(Question::new)
            .collect(Collectors.toUnmodifiableList());

        int index = 0;
        for (Question question : questions) {
            question.setPosition(index++);
        }

        ReviewForm reviewForm = new ReviewForm("title", questionValues);

        // when
        ReviewForm savedReviewForm = reviewFormRepository.save(reviewForm);

        // then
        assertAll(
            () -> assertThat(savedReviewForm.getId()).isNotNull(),
            () -> assertThat(savedReviewForm.getCode().length()).isEqualTo(8),
            () -> assertThat(savedReviewForm.getQuestions())
                .usingRecursiveComparison()
                .ignoringFields("id")
                .isEqualTo(questions)
        );
    }
}
