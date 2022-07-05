package com.reviewduck.acceptance;

import static org.assertj.core.api.Assertions.*;

import java.util.List;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;

import com.reviewduck.dto.request.AnswerRequest;
import com.reviewduck.dto.request.ReviewCreateRequest;
import com.reviewduck.dto.request.ReviewFormCreateRequest;
import com.reviewduck.dto.response.ReviewFormCreateResponse;
import com.reviewduck.dto.response.ReviewFormResponse;

public class ReviewAcceptanceTest extends AcceptanceTest {

    @Test
    @DisplayName("회고를 생성한다.")
    void createReview() {
        // given
        String reviewTitle = "title";
        List<String> questions = List.of("question1", "question2");
        String code = createReviewFormAndGetCode(reviewTitle, questions);

        // when, then
        // 질문조회
        ReviewFormResponse reviewFormResponse = get("/api/review-forms/" + code)
            .statusCode(HttpStatus.OK.value())
            .extract()
            .as(ReviewFormResponse.class);
        assertThat(reviewFormResponse.getReviewTitle()).isEqualTo(reviewTitle);

        // 리뷰생성
        ReviewCreateRequest createRequest = new ReviewCreateRequest("제이슨",
            List.of(new AnswerRequest(1L, "answer1"), new AnswerRequest(2L, "answer2")));
        post("/api/review-forms/" + code, createRequest)
            .statusCode(HttpStatus.CREATED.value());
    }

    @Test
    @DisplayName("회고 작성에 실패한다.")
    void failToCreateReview() {
        // given
        String reviewTitle = "title";
        List<String> questions = List.of("question1");
        String code = createReviewFormAndGetCode(reviewTitle, questions);

        // when, then
        // 질문조회
        ReviewFormResponse reviewFormResponse = get("/api/review-forms/" + code)
            .statusCode(HttpStatus.OK.value())
            .extract()
            .as(ReviewFormResponse.class);
        assertThat(reviewFormResponse.getReviewTitle()).isEqualTo(reviewTitle);

        // 리뷰생성
        ReviewCreateRequest createRequest = new ReviewCreateRequest("제이슨",
            List.of(new AnswerRequest(1L, "answer1"), new AnswerRequest(2L, "answer2")));
        post("/api/review-forms/" + code, createRequest)
            .statusCode(HttpStatus.BAD_REQUEST.value());

    }

    private String createReviewFormAndGetCode(String reviewTitle, List<String> questions) {
        // given
        ReviewFormCreateRequest request = new ReviewFormCreateRequest(reviewTitle, questions);

        // when, then
        return post("/api/review-forms", request)
            .extract()
            .as(ReviewFormCreateResponse.class)
            .getReviewFormCode();
    }
}
