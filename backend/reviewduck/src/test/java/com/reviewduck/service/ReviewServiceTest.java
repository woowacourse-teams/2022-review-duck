package com.reviewduck.service;

import static org.assertj.core.api.Assertions.*;
import static org.junit.jupiter.api.Assertions.*;

import java.util.List;

import javax.transaction.Transactional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.reviewduck.domain.Review;
import com.reviewduck.domain.ReviewForm;
import com.reviewduck.dto.request.AnswerRequest;
import com.reviewduck.dto.request.QuestionRequest;
import com.reviewduck.dto.request.ReviewCreateRequest;
import com.reviewduck.dto.request.ReviewFormCreateRequest;
import com.reviewduck.exception.NotFoundException;

@SpringBootTest
@Transactional
public class ReviewServiceTest {

    private final String invalidCode = "aaaaaaaa";
    @Autowired
    private ReviewFormService reviewFormService;
    @Autowired
    private ReviewService reviewService;
    private ReviewForm savedReviewForm;
    private Long questionId1;
    private Long questionId2;

    @BeforeEach
    void setUp() {
        String reviewTitle = "title";
        List<QuestionRequest> questions = List.of(new QuestionRequest("question1"),
            new QuestionRequest("question2"));
        ReviewFormCreateRequest createRequest = new ReviewFormCreateRequest(reviewTitle, questions);

        this.savedReviewForm = reviewFormService.save(createRequest);

        this.questionId1 = savedReviewForm.getQuestions().get(0).getId();
        this.questionId2 = savedReviewForm.getQuestions().get(1).getId();
    }

    @Test
    @DisplayName("리뷰를 저장한다.")
    void saveReview() {
        // when
        ReviewCreateRequest reviewCreateRequest = new ReviewCreateRequest("제이슨",
            List.of(new AnswerRequest(questionId1, "answer1"), new AnswerRequest(questionId2, "answer2")));
        Review savedReview = reviewService.save(savedReviewForm.getCode(), reviewCreateRequest);

        // then
        assertAll(
            () -> assertThat(savedReview.getId()).isNotNull(),
            () -> assertThat(savedReview.getNickname()).isEqualTo("제이슨"),
            () -> assertThat(savedReview.getQuestionAnswers().get(0).getAnswer().getValue())
                .isEqualTo("answer1")
        );
    }

    @Test
    @DisplayName("유효하지 않은 입장 코드로 리뷰를 저장할 수 없다.")
    void saveReviewWithInvalidCode() {
        // given
        ReviewCreateRequest reviewCreateRequest = new ReviewCreateRequest("제이슨",
            List.of(new AnswerRequest(1L, "answer1"), new AnswerRequest(2L, "answer2")));

        // when, then
        assertThatThrownBy(() -> reviewService.save(invalidCode, reviewCreateRequest))
            .isInstanceOf(NotFoundException.class)
            .hasMessageContaining("존재하지 않는 입장코드입니다.");
    }

    @Test
    @DisplayName("유효하지 않은 질문 번호로 회고를 작성할 수 없다.")
    void saveReviewWithInvalidQuestionId() {
        //given
        ReviewCreateRequest reviewCreateRequest = new ReviewCreateRequest("제이슨",
            List.of(new AnswerRequest(123445L, "answer1"),
                new AnswerRequest(2L, "answer2")));

        // when, then
        assertThatThrownBy(() -> reviewService.save(savedReviewForm.getCode(), reviewCreateRequest))
            .isInstanceOf(NotFoundException.class)
            .hasMessageContaining("존재하지 않는 질문입니다.");
    }

    @Test
    @DisplayName("특정 회고 폼을 기반으로 작성된 회고를 모두 조회한다.")
    void findReviewsBySpecificReviewForm() {
        // given
        ReviewCreateRequest reviewCreateRequest = new ReviewCreateRequest("제이슨",
            List.of(new AnswerRequest(questionId1, "answer1"), new AnswerRequest(questionId2, "answer2")));
        Review savedReview = reviewService.save(savedReviewForm.getCode(), reviewCreateRequest);

        // when
        List<Review> reviews = reviewService.findAllByCode(savedReviewForm.getCode());

        // then
        assertAll(
            () -> assertThat(reviews).hasSize(1),
            () -> assertThat(reviews.get(0).getNickname()).isEqualTo(savedReview.getNickname())
        );
    }
}
