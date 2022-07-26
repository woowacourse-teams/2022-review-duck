package com.reviewduck.review.service;

import static org.assertj.core.api.Assertions.*;
import static org.junit.jupiter.api.Assertions.*;

import java.util.List;
import java.util.stream.Collectors;

import javax.transaction.Transactional;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.jdbc.Sql;

import com.reviewduck.template.dto.request.TemplateQuestionRequest;
import com.reviewduck.review.domain.ReviewForm;
import com.reviewduck.review.domain.ReviewFormQuestion;
import com.reviewduck.template.domain.Template;
import com.reviewduck.review.dto.request.ReviewFormQuestionRequest;
import com.reviewduck.review.dto.request.ReviewQuestionUpdateRequest;
import com.reviewduck.review.dto.request.ReviewFormCreateFromTemplateRequest;
import com.reviewduck.review.dto.request.ReviewFormCreateRequest;
import com.reviewduck.review.dto.request.ReviewFormUpdateRequest;
import com.reviewduck.template.dto.request.TemplateCreateRequest;
import com.reviewduck.common.exception.NotFoundException;
import com.reviewduck.review.service.ReviewFormService;
import com.reviewduck.template.service.TemplateService;

@SpringBootTest
@Sql("classpath:truncate.sql")
@Transactional
public class ReviewFormServiceTest {

    private final String invalidCode = "aaaaaaaa";

    @Autowired
    private ReviewFormService reviewFormService;

    @Autowired
    private TemplateService templateService;

    @Test
    @DisplayName("회고 폼을 생성한다.")
    void createReviewForm() {
        // given
        String reviewTitle = "title";
        List<ReviewFormQuestionRequest> questions = List.of(new ReviewFormQuestionRequest("question1"),
            new ReviewFormQuestionRequest("question2"));

        ReviewFormCreateRequest createRequest = new ReviewFormCreateRequest(reviewTitle, questions);

        List<ReviewFormQuestion> expected = questions.stream()
            .map(questionRequest -> new ReviewFormQuestion(questionRequest.getQuestionValue()))
            .collect(Collectors.toList());

        int index = 0;
        for (ReviewFormQuestion reviewFormQuestion : expected) {
            reviewFormQuestion.setPosition(index++);
        }

        // when
        ReviewForm reviewForm = reviewFormService.save(createRequest);

        // then
        assertAll(
            () -> assertThat(reviewForm).isNotNull(),
            () -> assertThat(reviewForm.getId()).isNotNull(),
            () -> assertThat(reviewForm.getCode().length()).isEqualTo(8),
            () -> assertThat(reviewForm.getReviewTitle()).isEqualTo(reviewTitle),
            () -> assertThat(reviewForm.getReviewFormQuestions())
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
        List<ReviewFormQuestionRequest> questions = List.of(new ReviewFormQuestionRequest("question1"),
            new ReviewFormQuestionRequest("question2"));
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
        Long questionId = savedReviewForm.getReviewFormQuestions().get(0).getId();

        // when
        String reviewTitle = "new title";
        List<ReviewQuestionUpdateRequest> updateRequests = List.of(new ReviewQuestionUpdateRequest(questionId, "new question1"),
            new ReviewQuestionUpdateRequest(null, "new question3"));

        ReviewFormUpdateRequest updateRequest = new ReviewFormUpdateRequest(reviewTitle, updateRequests);

        List<ReviewFormQuestion> expected = updateRequests.stream()
            .map(questionRequest -> new ReviewFormQuestion(questionRequest.getQuestionValue()))
            .collect(Collectors.toList());

        int index = 0;
        for (ReviewFormQuestion reviewFormQuestion : expected) {
            reviewFormQuestion.setPosition(index++);
        }

        reviewFormService.update(code, updateRequest);
        ReviewForm foundReviewForm = reviewFormService.findByCode(code);

        assertAll(
            () -> assertThat(foundReviewForm).isNotNull(),
            () -> assertThat(foundReviewForm.getId()).isNotNull(),
            () -> assertThat(foundReviewForm.getCode().length()).isEqualTo(8),
            () -> assertThat(foundReviewForm.getReviewTitle()).isEqualTo(reviewTitle),
            () -> assertThat(foundReviewForm.getReviewFormQuestions())
                .usingRecursiveComparison()
                .ignoringFields("id")
                .isEqualTo(expected)
        );
    }

    @Test
    @DisplayName("존재하지 않는 회고폼을 수정할 수 없다.")
    void updateReviewFormByInvalidCode() {
        // when
        List<ReviewQuestionUpdateRequest> updateRequests = List.of(new ReviewQuestionUpdateRequest(1L, "new question1"),
            new ReviewQuestionUpdateRequest(null, "new question3"),
            new ReviewQuestionUpdateRequest(2L, "new question2"));

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
        List<ReviewQuestionUpdateRequest> updateRequests = List.of(new ReviewQuestionUpdateRequest(9999999L, "new question"));

        assertThatThrownBy(
            () -> reviewFormService.update(code, new ReviewFormUpdateRequest("new title", updateRequests)))
            .isInstanceOf(NotFoundException.class)
            .hasMessageContaining("존재하지 않는 질문입니다.");

    }

    @Test
    @DisplayName("템플릿을 기반으로 회고 폼을 생성한다.")
    void saveReviewFormFromTemplate() {
        // when
        // 템플릿 생성
        String templateTitle = "title";
        String templateDescription = "description";
        List<TemplateQuestionRequest> questions = List.of(new TemplateQuestionRequest("question1"),
            new TemplateQuestionRequest("question2"));

        TemplateCreateRequest templateRequest = new TemplateCreateRequest(templateTitle, templateDescription,
            questions);
        Template savedTemplate = templateService.save(templateRequest);

        // 템플릿 기반 회고 폼 생성
        String reviewFormTitle = "reviewFormTitle";
        ReviewFormCreateFromTemplateRequest request = new ReviewFormCreateFromTemplateRequest(reviewFormTitle);
        ReviewForm savedReviewForm = reviewFormService.saveFromTemplate(savedTemplate.getId(), request);

        List<ReviewFormQuestion> expected = questions.stream()
            .map(questionRequest -> new ReviewFormQuestion(questionRequest.getQuestionValue()))
            .collect(Collectors.toList());

        int index = 0;
        for (ReviewFormQuestion reviewFormQuestion : expected) {
            reviewFormQuestion.setPosition(index++);
        }

        // then
        assertAll(
            () -> assertThat(savedReviewForm).isNotNull(),
            () -> assertThat(savedReviewForm.getId()).isNotNull(),
            () -> assertThat(savedReviewForm.getCode().length()).isEqualTo(8),
            () -> assertThat(savedReviewForm.getReviewTitle()).isEqualTo(reviewFormTitle),
            () -> assertThat(savedReviewForm.getReviewFormQuestions())
                .usingRecursiveComparison()
                .ignoringFields("id")
                .isEqualTo(expected)
        );
    }

    private ReviewForm saveReviewForm() {
        List<ReviewFormQuestionRequest> createRequests = List.of(new ReviewFormQuestionRequest("question1"),
            new ReviewFormQuestionRequest("question2"));
        ReviewFormCreateRequest createRequest = new ReviewFormCreateRequest("title", createRequests);

        return reviewFormService.save(createRequest);
    }
}