package com.reviewduck.acceptance;

import static org.hamcrest.Matchers.*;

import java.util.List;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;

import com.reviewduck.dto.request.QuestionRequest;
import com.reviewduck.dto.request.QuestionUpdateRequest;
import com.reviewduck.dto.request.ReviewFormCreateFromTemplateRequest;
import com.reviewduck.dto.request.TemplateCreateRequest;
import com.reviewduck.dto.request.TemplateUpdateRequest;
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
        TemplateCreateRequest TemplateCreateRequest = new TemplateCreateRequest(templateTitle, description, questions);

        Long templateId = post("/api/templates", TemplateCreateRequest).extract()
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

    @Test
    @DisplayName("전체 템플릿을 조회한다.")
    void findAllTemplates() {
        // given
        List<QuestionRequest> questions1 = List.of(new QuestionRequest("question1"),
            new QuestionRequest("question2"));
        List<QuestionRequest> questions2 = List.of(new QuestionRequest("question3"),
            new QuestionRequest("question4"));
        TemplateCreateRequest request1 = new TemplateCreateRequest("title1", "test description1",
            questions1);
        TemplateCreateRequest request2 = new TemplateCreateRequest("title2", "test description2",
            questions2);
        post("/api/templates", request1);
        post("/api/templates", request2);

        // when, then
        get("/api/templates").statusCode(HttpStatus.OK.value())
            .assertThat().body("templates", hasSize(2));

    }

    @Test
    @DisplayName("존재하지 않는 템플릿을 조회할 수 없다.")
    void findTemplateWithInvalidId() {

        // when, then
        get("/api/templates/" + 9999L).statusCode(HttpStatus.NOT_FOUND.value());
    }

    @Test
    @DisplayName("템플릿을 조회한다.")
    void findTemplate() {

        //given
        String templateTitle = "title";
        String templateDescription = "test description";
        List<QuestionRequest> questions = List.of(new QuestionRequest("question1"),
            new QuestionRequest("question2"));
        TemplateCreateRequest request = new TemplateCreateRequest(templateTitle, templateDescription, questions);

        Long templateId = post("/api/templates", request).extract()
            .as(TemplateCreateResponse.class)
            .getTemplateId();

        // when, then
        get("/api/templates/" + templateId).statusCode(HttpStatus.OK.value())
            .assertThat()
            .body("templateId", notNullValue())
            .body("templateTitle", equalTo(templateTitle))
            .body("questions", hasSize(questions.size()));
    }

    @Test
    @DisplayName("존재하지 않는 템플릿을 삭제할 수 없다.")
    void deleteTemplateWithInvalidId() {

        // when, then
        delete("/api/templates/" + 9999L).statusCode(HttpStatus.NOT_FOUND.value());
    }

    @Test
    @DisplayName("템플릿을 삭제한다.")
    void deleteTemplate() {
        //given
        String templateTitle = "title";
        String templateDescription = "test description";
        List<QuestionRequest> questions = List.of(new QuestionRequest("question1"),
            new QuestionRequest("question2"));
        TemplateCreateRequest request = new TemplateCreateRequest(templateTitle, templateDescription, questions);

        Long templateId = post("/api/templates", request).extract()
            .as(TemplateCreateResponse.class)
            .getTemplateId();

        // when, then
        delete("/api/templates/" + templateId).statusCode(HttpStatus.NO_CONTENT.value());
    }

    @Test
    @DisplayName("템플릿을 수정한다.")
    void updateTemplate() {
        // given
        String templateTitle = "title";
        String templateDescription = "test description";
        List<QuestionRequest> questions = List.of(new QuestionRequest("question1"),
            new QuestionRequest("question2"));
        TemplateCreateRequest createRequest = new TemplateCreateRequest(templateTitle, templateDescription, questions);

        Long templateId = post("/api/templates", createRequest).extract()
            .as(TemplateCreateResponse.class)
            .getTemplateId();

        // when, then
        String newTemplateTitle = "new title";
        String newTemplateDescription = "new test description";
        List<QuestionUpdateRequest> newQuestions = List.of(
            new QuestionUpdateRequest(1L, "new question1"),
            new QuestionUpdateRequest(2L, "question2"),
            new QuestionUpdateRequest(null, "question3")
        );
        TemplateUpdateRequest updateRequest = new TemplateUpdateRequest(newTemplateTitle, newTemplateDescription,
            newQuestions);

        put("/api/templates/" + templateId, updateRequest).statusCode(HttpStatus.NO_CONTENT.value());
    }

    @Test
    @DisplayName("존재하지 않는 템플릿을 수정할 수 없다.")
    void updateTemplateWithInvalidId() {
        // when, then
        put("/api/templates/" + 9999L, new TemplateUpdateRequest("title", "description", List.of()))
            .statusCode(HttpStatus.NOT_FOUND.value());
    }
}
