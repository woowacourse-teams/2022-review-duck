package com.reviewduck.template.acceptance;

import static org.hamcrest.Matchers.*;

import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;

import com.reviewduck.acceptance.AcceptanceTest;
import com.reviewduck.auth.support.JwtTokenProvider;
import com.reviewduck.member.domain.Member;
import com.reviewduck.member.service.MemberService;
import com.reviewduck.review.dto.request.ReviewFormCreateFromTemplateRequest;
import com.reviewduck.template.dto.request.TemplateCreateRequest;
import com.reviewduck.template.dto.request.TemplateQuestionRequest;
import com.reviewduck.template.dto.request.TemplateQuestionUpdateRequest;
import com.reviewduck.template.dto.request.TemplateUpdateRequest;
import com.reviewduck.template.dto.response.TemplateCreateResponse;

public class TemplateAcceptanceTest extends AcceptanceTest {
    private static String accessToken;
    @Autowired
    private JwtTokenProvider jwtTokenProvider;
    @Autowired
    private MemberService memberService;

    @BeforeEach
    void createMemberAndGetAccessToken() {
        Member member = new Member("panda", "제이슨", "profileUrl");
        memberService.save(member);
        accessToken = jwtTokenProvider.createToken("1");
    }

    @Test
    @DisplayName("템플릿을 생성한다.")
    void createTemplate() {
        // given
        String templateTitle = "title";
        String templateDescription = "test description";
        List<TemplateQuestionRequest> questions = List.of(new TemplateQuestionRequest("question1"),
            new TemplateQuestionRequest("question2"));
        TemplateCreateRequest request = new TemplateCreateRequest(templateTitle, templateDescription, questions);

        // when, then
        post("/api/templates", request, accessToken).statusCode(HttpStatus.CREATED.value())
            .assertThat().body("templateId", notNullValue());
    }

    @Test
    @DisplayName("템플릿을 기반으로 회고 폼을 생성한다.")
    void createReviewFormFromTemplate() {
        // given
        String templateTitle = "title";
        String description = "test description";
        List<TemplateQuestionRequest> questions = List.of(new TemplateQuestionRequest("question1"),
            new TemplateQuestionRequest("question2"));
        TemplateCreateRequest templateCreateRequest = new TemplateCreateRequest(templateTitle, description, questions);

        Long templateId = post("/api/templates", templateCreateRequest, accessToken).extract()
            .as(TemplateCreateResponse.class)
            .getTemplateId();

        // when, then
        ReviewFormCreateFromTemplateRequest request = new ReviewFormCreateFromTemplateRequest("reviewFormTitle");
        post("/api/templates/" + templateId + "/review-forms", request, accessToken).statusCode(HttpStatus.CREATED.value())
            .assertThat().body("reviewFormCode", notNullValue());
    }

    @Test
    @DisplayName("존재하지 않는 템플릿을 기반으로 회고 폼을 생성할 수 없다.")
    void createReviewFormFromTemplateWithInvalidId() {

        // when, then
        ReviewFormCreateFromTemplateRequest request = new ReviewFormCreateFromTemplateRequest("reviewFormTitle");
        post("/api/templates/9999/review-forms", request, accessToken).statusCode(HttpStatus.NOT_FOUND.value());
    }

    @Test
    @DisplayName("전체 템플릿을 조회한다.")
    void findAllTemplates() {
        // given
        List<TemplateQuestionRequest> questions1 = List.of(new TemplateQuestionRequest("question1"),
            new TemplateQuestionRequest("question2"));
        List<TemplateQuestionRequest> questions2 = List.of(new TemplateQuestionRequest("question3"),
            new TemplateQuestionRequest("question4"));
        TemplateCreateRequest request1 = new TemplateCreateRequest("title1", "test description1",
            questions1);
        TemplateCreateRequest request2 = new TemplateCreateRequest("title2", "test description2",
            questions2);
        post("/api/templates", request1, accessToken);
        post("/api/templates", request2, accessToken);

        // when, then
        get("/api/templates", accessToken).statusCode(HttpStatus.OK.value())
            .assertThat().body("templates", hasSize(2));

    }

    @Test
    @DisplayName("존재하지 않는 템플릿을 조회할 수 없다.")
    void findTemplateWithInvalidId() {

        // when, then
        get("/api/templates/" + 9999L, accessToken).statusCode(HttpStatus.NOT_FOUND.value());
    }

    @Test
    @DisplayName("템플릿을 조회한다.")
    void findTemplate() {

        //given
        String templateTitle = "title";
        String templateDescription = "test description";
        List<TemplateQuestionRequest> questions = List.of(new TemplateQuestionRequest("question1"),
            new TemplateQuestionRequest("question2"));
        TemplateCreateRequest request = new TemplateCreateRequest(templateTitle, templateDescription, questions);

        Long templateId = post("/api/templates", request, accessToken).extract()
            .as(TemplateCreateResponse.class)
            .getTemplateId();

        // when, then
        get("/api/templates/" + templateId, accessToken).statusCode(HttpStatus.OK.value())
            .assertThat()
            .body("templateId", notNullValue())
            .body("templateTitle", equalTo(templateTitle))
            .body("questions", hasSize(questions.size()));
    }

    @Test
    @DisplayName("존재하지 않는 템플릿을 삭제할 수 없다.")
    void deleteTemplateWithInvalidId() {

        // when, then
        delete("/api/templates/" + 9999L, accessToken).statusCode(HttpStatus.NOT_FOUND.value());
    }

    @Test
    @DisplayName("템플릿을 삭제한다.")
    void deleteTemplate() {
        // given
        String templateTitle = "title";
        String templateDescription = "test description";
        List<TemplateQuestionRequest> questions = List.of(new TemplateQuestionRequest("question1"),
            new TemplateQuestionRequest("question2"));
        TemplateCreateRequest request = new TemplateCreateRequest(templateTitle, templateDescription, questions);

        Long templateId = post("/api/templates", request, accessToken).extract()
            .as(TemplateCreateResponse.class)
            .getTemplateId();

        // when, then
        delete("/api/templates/" + templateId, accessToken).statusCode(HttpStatus.NO_CONTENT.value());
    }

    @Test
    @DisplayName("템플릿을 수정한다.")
    void updateTemplate() {
        // given
        String templateTitle = "title";
        String templateDescription = "test description";
        List<TemplateQuestionRequest> questions = List.of(new TemplateQuestionRequest("question1"),
            new TemplateQuestionRequest("question2"));
        TemplateCreateRequest createRequest = new TemplateCreateRequest(templateTitle, templateDescription, questions);

        Long templateId = post("/api/templates", createRequest, accessToken).extract()
            .as(TemplateCreateResponse.class)
            .getTemplateId();

        // when, then
        String newTemplateTitle = "new title";
        String newTemplateDescription = "new test description";
        List<TemplateQuestionUpdateRequest> newQuestions = List.of(
            new TemplateQuestionUpdateRequest(1L, "new question1"),
            new TemplateQuestionUpdateRequest(2L, "question2"),
            new TemplateQuestionUpdateRequest(null, "question3")
        );
        TemplateUpdateRequest updateRequest = new TemplateUpdateRequest(newTemplateTitle, newTemplateDescription,
            newQuestions);

        put("/api/templates/" + templateId, updateRequest, accessToken).statusCode(HttpStatus.NO_CONTENT.value());
    }

    @Test
    @DisplayName("존재하지 않는 템플릿을 수정할 수 없다.")
    void updateTemplateWithInvalidId() {
        // when, then
        put("/api/templates/" + 9999L, new TemplateUpdateRequest("title", "description", List.of()), accessToken)
            .statusCode(HttpStatus.NOT_FOUND.value());
    }
}
