package com.reviewduck.filter;

import static org.assertj.core.api.Assertions.*;

import java.util.List;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import com.reviewduck.acceptance.AcceptanceTest;
import com.reviewduck.review.dto.request.ReviewFormCreateRequest;
import com.reviewduck.review.dto.request.ReviewFormQuestionRequest;
import com.reviewduck.review.dto.response.ReviewFormCodeResponse;
import com.reviewduck.review.dto.response.ReviewFormResponse;

public class XssFilterTest extends AcceptanceTest {

    @Test
    @DisplayName("Xss 공격이 들어오면 변환하여 반환한다.")
    void xssFilter() {
        // given
        String XssQuestionValue = "<script>alert(\"xss\")</script>";
        List<ReviewFormQuestionRequest> questions = List.of(new ReviewFormQuestionRequest(XssQuestionValue),
            new ReviewFormQuestionRequest("question2"));
        ReviewFormCreateRequest request = new ReviewFormCreateRequest("title", questions);

        // when
        String reviewFormCode = post("/api/review-forms", request)
            .extract()
            .as(ReviewFormCodeResponse.class)
            .getReviewFormCode();

        String actual = get("/api/review-forms/" + reviewFormCode)
            .extract()
            .as(ReviewFormResponse.class)
            .getQuestions()
            .get(0)
            .getQuestionValue();

        // then
        assertThat(actual).isNotEqualTo(XssQuestionValue);
    }
}
