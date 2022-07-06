package com.reviewduck.acceptance;

import static org.hamcrest.Matchers.*;

import java.util.List;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;

import com.reviewduck.dto.request.ReviewFormCreateRequest;

public class ReviewFormAcceptanceTest extends AcceptanceTest {

    @Test
    @DisplayName("회고 폼을 생성한다.")
    void createReviewForm() {
        // given
        String reviewTitle = "title";
        List<String> questions = List.of("question1", "question2");
        ReviewFormCreateRequest request = new ReviewFormCreateRequest(reviewTitle, questions);

        // when, then
        post("/api/review-forms", request).statusCode(HttpStatus.CREATED.value())
            .assertThat().body("reviewFormCode", notNullValue());
    }

    @Test
    @DisplayName("회고폼 조회에 실패한다.")
    void failToFindReviewForm() {
        // when, then
        get("/api/review-forms/" + "AAAAAAAA")
            .statusCode(HttpStatus.NOT_FOUND.value());
    }
}
