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
import com.reviewduck.dto.request.QuestionRequest;
import com.reviewduck.dto.request.QuestionUpdateRequest;
import com.reviewduck.dto.request.ReviewFormCreateRequest;
import com.reviewduck.dto.request.ReviewFormUpdateRequest;
import com.reviewduck.exception.NotFoundException;

@SpringBootTest
@Transactional
public class ReviewFormServiceTest {

    private final String invalidCode = "aaaaaaaa";

    @Autowired
    private ReviewFormService reviewFormService;

    @Test
    @DisplayName("회고 폼을 생성한다.")
    void createReviewForm() {
        // given
        String reviewTitle = "title";
        List<QuestionRequest> questions = List.of(new QuestionRequest("question1"),
            new QuestionRequest("question2"));

        ReviewFormCreateRequest createRequest = new ReviewFormCreateRequest(reviewTitle, questions);

        List<Question> expected = questions.stream()
            .map(questionRequest -> new Question(questionRequest.getQuestionValue()))
            .collect(Collectors.toList());

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
                .isEqualTo(expected)
        );
    }

    @Test
    @DisplayName("회고 폼을 조회한다.")
    void findReviewForm() {
        // given
        String reviewTitle = "title";
        List<QuestionRequest> questions = List.of(new QuestionRequest("question1"),
            new QuestionRequest("question2"));
        ReviewFormCreateRequest createRequest = new ReviewFormCreateRequest(reviewTitle, questions);

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
        assertThatThrownBy(() -> reviewFormService.findByCode(invalidCode))
            .isInstanceOf(NotFoundException.class)
            .hasMessageContaining("존재하지 않는 회고 폼입니다.");
    }

    @Test
    @DisplayName("회고 폼을 수정한다.")
    void updateReviewForm() {
        // given
        ReviewForm savedReviewForm = saveReviewForm();
        String code = savedReviewForm.getCode();
        Long questionId = savedReviewForm.getQuestions().get(0).getId();

        // when
        String reviewTitle = "new title";
        List<QuestionUpdateRequest> updateRequests = List.of(new QuestionUpdateRequest(questionId, "new question1"),
            new QuestionUpdateRequest(null, "new question3"));

        ReviewFormUpdateRequest updateRequest = new ReviewFormUpdateRequest(reviewTitle, updateRequests);

        ReviewForm reviewForm = reviewFormService.update(code, updateRequest);

        assertThat(reviewFormService.findByCode(code)).isSameAs(reviewForm);
    }

    @Test
    @DisplayName("존재하지 않는 회고폼을 수정할 수 없다.")
    void updateReviewFormByInvalidCode() {
        // when
        List<QuestionUpdateRequest> updateRequests = List.of(new QuestionUpdateRequest(1L, "new question1"),
            new QuestionUpdateRequest(null, "new question3"),
            new QuestionUpdateRequest(2L, "new question2"));

        assertThatThrownBy(
            () -> reviewFormService.update(invalidCode,
                new ReviewFormUpdateRequest("new title", updateRequests)))
            .isInstanceOf(NotFoundException.class)
            .hasMessageContaining("존재하지 않는 회고 폼입니다.");
    }

    @Test
    @DisplayName("존재하지 않는 질문을 수정할 수 없다.")
    void updateReviewFormByInvalidQuestionId() {
        // given
        String code = saveReviewForm().getCode();

        // when, then
        List<QuestionUpdateRequest> updateRequests = List.of(new QuestionUpdateRequest(9999999L, "new question"));

        assertThatThrownBy(
            () -> reviewFormService.update(code, new ReviewFormUpdateRequest("new title", updateRequests)))
            .isInstanceOf(NotFoundException.class)
            .hasMessageContaining("존재하지 않는 질문입니다.");

    }

    private ReviewForm saveReviewForm() {
        List<QuestionRequest> createRequests = List.of(new QuestionRequest("question1"),
            new QuestionRequest("question2"));
        ReviewFormCreateRequest createRequest = new ReviewFormCreateRequest("title", createRequests);

        return reviewFormService.save(createRequest);
    }
}
