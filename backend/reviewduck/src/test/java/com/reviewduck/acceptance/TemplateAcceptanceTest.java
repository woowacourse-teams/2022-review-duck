package com.reviewduck.acceptance;

import static org.hamcrest.Matchers.*;

import java.util.List;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;

import com.reviewduck.dto.request.QuestionRequest;
import com.reviewduck.dto.request.ReviewFormCreateFromTemplateRequest;
import com.reviewduck.dto.request.TemplateCreateRequest;
import com.reviewduck.dto.response.TemplateCreateResponse;

public class TemplateAcceptanceTest extends AcceptanceTest {

    @Test
    @DisplayName("템플릿을 생성한다.")
    void createTemplate() {
        // given
        String templateTitle = "title";
        String templateDescription = "test description";
        List<QuestionRequest> questions = List.of(new QuestionRequest("question1"),
            new QuestionRequest("question2"));
        TemplateCreateRequest request = new TemplateCreateRequest(templateTitle, templateDescription, questions);

        // when, then
        post("/api/templates", request).statusCode(HttpStatus.CREATED.value())
            .assertThat().body("templateId", notNullValue());
    }

    @Test
    @DisplayName("템플릿을 기반으로 회고 폼을 생성한다.")
    void createReviewFormFromTemplate() {
        // given
        String templateTitle = "title";
        String description = "test description";
        List<QuestionRequest> questions = List.of(new QuestionRequest("question1"),
            new QuestionRequest("question2"));
        TemplateCreateRequest templateCreateRequest = new TemplateCreateRequest(templateTitle, description, questions);

        Long templateId = post("/api/templates", templateCreateRequest).extract()
            .as(TemplateCreateResponse.class)
            .getTemplateId();

        // when, then
        ReviewFormCreateFromTemplateRequest request = new ReviewFormCreateFromTemplateRequest("reviewFormTitle");
        post("/api/templates/" + templateId + "/review-forms", request).statusCode(HttpStatus.CREATED.value())
            .assertThat().body("reviewFormCode", notNullValue());
    }

    @Test
    @DisplayName("존재하지 않는 템플릿을 기반으로 회고 폼을 생성할 수 없다.")
    void createReviewFormFromTemplateWithInvalidId() {

        // when, then
        ReviewFormCreateFromTemplateRequest request = new ReviewFormCreateFromTemplateRequest("reviewFormTitle");
        post("/api/templates/9999/review-forms", request).statusCode(HttpStatus.NOT_FOUND.value());
    }
}
