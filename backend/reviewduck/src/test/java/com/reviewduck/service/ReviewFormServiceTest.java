package com.reviewduck.service;

import static org.assertj.core.api.Assertions.*;
import static org.junit.jupiter.api.Assertions.*;

import java.util.List;
import java.util.stream.Collectors;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.reviewduck.domain.Question;
import com.reviewduck.domain.ReviewForm;
import com.reviewduck.dto.ReviewFormCreateRequest;

@SpringBootTest
public class ReviewFormServiceTest {

    @Autowired
    private ReviewFormService reviewFormService;

    @Test
    @DisplayName("회고 폼을 생성한다.")
    void createReviewForm() {
        // given
        String reviewTitle = "title";
        List<String> questionValues = List.of("question1", "question2");
        List<Question> questions = questionValues.stream()
            .map(Question::new)
            .collect(Collectors.toList());
        ReviewFormCreateRequest createRequest = new ReviewFormCreateRequest(reviewTitle, questionValues);

        // when
        ReviewForm reviewForm = reviewFormService.save(createRequest);

        // then
        assertAll(
            () -> assertThat(reviewForm).isNotNull(),
            () -> assertThat(reviewForm.getId()).isNotNull(),
            () -> assertThat(reviewForm.getCode().length()).isEqualTo(16),
            () -> assertThat(reviewForm.getReviewTitle()).isEqualTo(reviewTitle),
            () -> assertThat(reviewForm.getQuestions())
                .usingRecursiveComparison()
                .ignoringFields("id")
                .isEqualTo(questions)
        );

    }

}
