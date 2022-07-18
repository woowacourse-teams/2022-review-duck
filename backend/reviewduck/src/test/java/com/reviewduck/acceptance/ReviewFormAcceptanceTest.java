package com.reviewduck.acceptance;

import static org.assertj.core.api.Assertions.*;
import static org.hamcrest.Matchers.*;
import static org.junit.jupiter.api.Assertions.*;

import java.util.List;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;

import com.reviewduck.dto.request.QuestionRequest;
import com.reviewduck.dto.request.QuestionUpdateRequest;
import com.reviewduck.dto.request.ReviewFormCreateRequest;
import com.reviewduck.dto.request.ReviewFormUpdateRequest;
import com.reviewduck.dto.response.ReviewFormCodeResponse;
import com.reviewduck.dto.response.ReviewFormResponse;

public class ReviewFormAcceptanceTest extends AcceptanceTest {

    @Test
    @DisplayName("회고 폼을 생성한다.")
    void createReviewForm() {
        // given
        String reviewTitle = "title";
        List<QuestionRequest> questions = List.of(new QuestionRequest("question1"),
            new QuestionRequest("question2"));
        ReviewFormCreateRequest request = new ReviewFormCreateRequest(reviewTitle, questions);

        // when, then
        post("/api/review-forms", request).statusCode(HttpStatus.CREATED.value())
            .assertThat().body("reviewFormCode", notNullValue());
    }

    @Test
    @DisplayName("회고폼을 조회한다.")
    void findReviewForm() {
        // given
        String reviewTitle = "title";
        List<QuestionRequest> questions = List.of(new QuestionRequest("question1"),
            new QuestionRequest("question2"));
        String reviewFormCode = createReviewFormAndGetCode(reviewTitle, questions);

        // when
        ReviewFormResponse response = get("/api/review-forms/" + reviewFormCode)
            .statusCode(HttpStatus.OK.value())
            .extract()
            .as(ReviewFormResponse.class);

        // then
        assertAll(
            () -> assertThat(response.getReviewTitle()).isEqualTo(reviewTitle),
            () -> assertThat(response.getQuestions()).hasSize(2)
        );
    }

    @Test
    @DisplayName("회고폼 조회에 실패한다.")
    void failToFindReviewForm() {
        // when, then
        get("/api/review-forms/" + "AAAAAAAA")
            .statusCode(HttpStatus.NOT_FOUND.value());
    }

    @Test
    @DisplayName("회고폼을 수정한다.")
    void updateReviewForm() {
        // given
        List<QuestionRequest> createQuestions = List.of(new QuestionRequest("question1"),
            new QuestionRequest("question2"));
        String createReviewFormCode = createReviewFormAndGetCode("title", createQuestions);

        // when, then
        String newReviewTitle = "new title";
        List<QuestionUpdateRequest> updateQuestions = List.of(new QuestionUpdateRequest(1L, "new question1"));
        ReviewFormUpdateRequest updateRequest = new ReviewFormUpdateRequest(newReviewTitle, updateQuestions);
        put("/api/review-forms/" + createReviewFormCode, updateRequest)
            .statusCode(HttpStatus.OK.value())
            .assertThat().body("reviewFormCode", equalTo(createReviewFormCode));

        ReviewFormResponse getResponse = get("/api/review-forms/" + createReviewFormCode)
            .extract()
            .as(ReviewFormResponse.class);
        assertAll(
            () -> assertThat(getResponse.getReviewTitle()).isEqualTo(newReviewTitle),
            () -> assertThat(getResponse.getQuestions()).hasSize(1),
            () -> assertThat(getResponse.getQuestions().get(0).getQuestionId()).isEqualTo(1L),
            () -> assertThat(getResponse.getQuestions().get(0).getQuestionValue()).isEqualTo("new question1")
        );
    }

    @Test
    @DisplayName("존재하지 않는 회고폼을 수정할 수 없다.")
    void updateInvalidReviewForm() {
        // when, then
        List<QuestionUpdateRequest> updateQuestions = List.of(new QuestionUpdateRequest(1L, "new question1"));
        ReviewFormUpdateRequest updateRequest = new ReviewFormUpdateRequest("newTitle", updateQuestions);

        put("/api/review-forms/aaaaaaaa", updateRequest)
            .statusCode(HttpStatus.NOT_FOUND.value());
    }

    private String createReviewFormAndGetCode(String reviewTitle, List<QuestionRequest> questions) {
        ReviewFormCreateRequest request = new ReviewFormCreateRequest(reviewTitle, questions);

        return post("/api/review-forms", request)
            .extract()
            .as(ReviewFormCodeResponse.class)
            .getReviewFormCode();
    }
}
