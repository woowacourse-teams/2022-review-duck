package com.reviewduck.service;

import static org.assertj.core.api.Assertions.*;
import static org.junit.jupiter.api.Assertions.*;

import java.util.List;
import java.util.stream.Collectors;

import javax.transaction.Transactional;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.reviewduck.domain.Question;
import com.reviewduck.domain.ReviewForm;
import com.reviewduck.dto.request.ReviewFormCreateRequest;
import com.reviewduck.exception.NotFoundException;

@SpringBootTest
@Transactional
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
            .collect(Collectors.toUnmodifiableList());
        ReviewFormCreateRequest createRequest = new ReviewFormCreateRequest(reviewTitle, questionValues);

        // when
        ReviewForm reviewForm = reviewFormService.save(createRequest);

        // then
        assertAll(
            () -> assertThat(reviewForm).isNotNull(),
            () -> assertThat(reviewForm.getId()).isNotNull(),
            () -> assertThat(reviewForm.getCode().length()).isEqualTo(8),
            () -> assertThat(reviewForm.getReviewTitle()).isEqualTo(reviewTitle),
            () -> assertThat(reviewForm.getQuestions())
                .usingRecursiveComparison()
                .ignoringFields("id")
                .isEqualTo(questions)
        );
    }

    @Test
    @DisplayName("회고 폼을 조회한다.")
    void findReviewForm() {
        // given
        String reviewTitle = "title";
        List<String> questionValues = List.of("question1", "question2");
        ReviewFormCreateRequest createRequest = new ReviewFormCreateRequest(reviewTitle, questionValues);

        ReviewForm expected = reviewFormService.save(createRequest);

        // when
        ReviewForm actual = reviewFormService.findByCode(expected.getCode());

        // then
        assertThat(expected).isSameAs(actual);
    }

    @Test
    @DisplayName("존재하지 않는 코드로 조회할 수 없다.")
    void findReviewFormByInvalidCode() {
        // when, then
        assertThatThrownBy(() -> reviewFormService.findByCode("aaaaaaaa"))
            .isInstanceOf(NotFoundException.class)
            .hasMessageContaining("존재하지 않는 입장코드입니다.");
    }
}
