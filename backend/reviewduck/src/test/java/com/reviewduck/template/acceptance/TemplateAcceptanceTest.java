package com.reviewduck.template.acceptance;

import static org.assertj.core.api.Assertions.*;
import static org.hamcrest.Matchers.*;
import static org.junit.jupiter.api.Assertions.*;

import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;

import com.reviewduck.acceptance.AcceptanceTest;
import com.reviewduck.auth.support.JwtTokenProvider;
import com.reviewduck.member.domain.Member;
import com.reviewduck.member.dto.response.MemberResponse;
import com.reviewduck.member.service.MemberService;
import com.reviewduck.review.dto.request.ReviewFormCreateFromTemplateRequest;
import com.reviewduck.template.dto.request.TemplateCreateRequest;
import com.reviewduck.template.dto.request.TemplateQuestionCreateRequest;
import com.reviewduck.template.dto.request.TemplateQuestionUpdateRequest;
import com.reviewduck.template.dto.request.TemplateUpdateRequest;
import com.reviewduck.template.dto.response.MyTemplatesResponse;
import com.reviewduck.template.dto.response.TemplateIdResponse;

public class TemplateAcceptanceTest extends AcceptanceTest {

    @Autowired
    private JwtTokenProvider jwtTokenProvider;
    @Autowired
    private MemberService memberService;

    private String accessToken1;
    private String accessToken2;

    @BeforeEach
    void createMemberAndGetAccessToken() {
        Member member1 = new Member("1", "panda", "제이슨", "profileUrl1");
        Member savedMember1 = memberService.save(member1);

        Member member2 = new Member("2", "ariari", "브리", "profileUrl2");
        Member savedMember2 = memberService.save(member2);

        accessToken1 = jwtTokenProvider.createAccessToken(String.valueOf(savedMember1.getId()));
        accessToken2 = jwtTokenProvider.createAccessToken(String.valueOf(savedMember2.getId()));
    }

    @Nested
    @DisplayName("템플릿 생성")
    class createTemplate {

        @Test
        @DisplayName("템플릿을 생성한다.")
        void createTemplate() {
            // given
            String templateTitle = "title";
            String templateDescription = "test description";
            List<TemplateQuestionCreateRequest> questions = List.of(new TemplateQuestionCreateRequest("question1"),
                new TemplateQuestionCreateRequest("question2"));
            TemplateCreateRequest request = new TemplateCreateRequest(templateTitle, templateDescription, questions);

            // when, then
            post("/api/templates", request, accessToken1).statusCode(HttpStatus.CREATED.value())
                .assertThat().body("templateId", notNullValue());
        }

        @Test
        @DisplayName("로그인하지 않은 상태로 템플릿을 생성할 수 없다.")
        void withoutLogin() {
            // given
            String templateTitle = "title";
            String templateDescription = "test description";
            List<TemplateQuestionCreateRequest> questions = List.of(new TemplateQuestionCreateRequest("question1"),
                new TemplateQuestionCreateRequest("question2"));
            TemplateCreateRequest request = new TemplateCreateRequest(templateTitle, templateDescription, questions);

            // when, then
            post("/api/templates", request).statusCode(HttpStatus.UNAUTHORIZED.value());
        }

    }

    @Nested
    @DisplayName("템플릿 기반 회고 폼 생성")
    class createReviewFormFromTemplate {

        @Test
        @DisplayName("템플릿을 기반으로 회고 폼을 생성한다.")
        void createReviewFormFromTemplate() {
            // given
            long templateId = saveTemplateAndGetId(accessToken1);

            // when, then
            post("/api/templates/" + templateId + "/review-forms", accessToken1)
                .statusCode(HttpStatus.CREATED.value())
                .assertThat().body("reviewFormCode", notNullValue());
        }

        @Test
        @DisplayName("로그인하지 않은 상태로 템플릿을 기반으로 회고 폼을 생성할 수 없다.")
        void withoutLogin() {
            // given
            long templateId = saveTemplateAndGetId(accessToken1);

            // when, then
            ReviewFormCreateFromTemplateRequest request = new ReviewFormCreateFromTemplateRequest("reviewFormTitle");
            post("/api/templates/" + templateId + "/review-forms", request)
                .statusCode(HttpStatus.UNAUTHORIZED.value());
        }

        @Test
        @DisplayName("존재하지 않는 템플릿을 기반으로 회고 폼을 생성할 수 없다.")
        void invalidId() {
            // when, then
            ReviewFormCreateFromTemplateRequest request = new ReviewFormCreateFromTemplateRequest("reviewFormTitle");
            post("/api/templates/9999/review-forms", request, accessToken1).statusCode(HttpStatus.NOT_FOUND.value());
        }

    }

    @Nested
    @DisplayName("전체 템플릿 조회")
    class findAllTemplates {

        @Test
        @DisplayName("전체 템플릿을 조회한다.")
        void findAllTemplates() {
            // given
            saveTemplateAndGetId(accessToken1);
            saveTemplateAndGetId(accessToken2);

            // when, then
            get("/api/templates", accessToken1).statusCode(HttpStatus.OK.value())
                .assertThat().body("templates", hasSize(2));

        }

        @Test
        @DisplayName("로그인하지 않은 상태로 전체 템플릿을 조회할 수 없다.")
        void withoutLogin() {
            get("/api/templates").statusCode(HttpStatus.UNAUTHORIZED.value());
        }

    }

    @Nested
    @DisplayName("특정 템플릿 조회")
    class findTemplate {

        @Test
        @DisplayName("특정 템플릿을 조회한다.")
        void findTemplate() {
            //given
            long templateId = saveTemplateAndGetId(accessToken1);

            // when, then
            get("/api/templates/" + templateId, accessToken1).statusCode(HttpStatus.OK.value())
                .assertThat()
                .body("info.id", notNullValue())
                .body("info.title", equalTo("title"))
                .body("questions", hasSize(2));
        }

        @Test
        @DisplayName("로그인하지 않은 상태로 특정 템플릿을 조회할 수 없다.")
        void withoutLogin() {
            //given
            long templateId = saveTemplateAndGetId(accessToken1);

            // when, then
            get("/api/templates/" + templateId).statusCode(HttpStatus.UNAUTHORIZED.value());
        }

        @Test
        @DisplayName("존재하지 않는 템플릿을 조회할 수 없다.")
        void invalidId() {
            // when, then
            get("/api/templates/" + 9999L, accessToken1).statusCode(HttpStatus.NOT_FOUND.value());
        }

    }

    @Nested
    @DisplayName("사용자가 작성한 템플릿 조회")
    class findMemberBySocialId {

        @Test
        @DisplayName("사용자가 작성한 템플릿을 최근 수정시각을 기준으로 내림차순 정렬하여 조회한다.")
        void findMemberBySocialIdOrderByUpdatedAt() {
            // given
            // save template
            String templateTitle1 = "title1";
            String templateDescription1 = "test description1";
            List<TemplateQuestionCreateRequest> questions1 = List.of(
                new TemplateQuestionCreateRequest("question1"),
                new TemplateQuestionCreateRequest("question2"));
            TemplateCreateRequest request1 = new TemplateCreateRequest(templateTitle1, templateDescription1,
                questions1);
            post("/api/templates", request1, accessToken1);

            String templateTitle2 = "title2";
            String templateDescription2 = "test description2";
            List<TemplateQuestionCreateRequest> questions2 = List.of(
                new TemplateQuestionCreateRequest("question3"),
                new TemplateQuestionCreateRequest("question4"));
            TemplateCreateRequest request2 = new TemplateCreateRequest(templateTitle2, templateDescription2,
                questions2);
            post("/api/templates", request2, accessToken2);

            String templateTitle3 = "title3";
            String templateDescription3 = "test description3";
            List<TemplateQuestionCreateRequest> questions3 = List.of
                (new TemplateQuestionCreateRequest("question5"),
                    new TemplateQuestionCreateRequest("question6"));
            TemplateCreateRequest request3 = new TemplateCreateRequest(templateTitle3, templateDescription3,
                questions3);
            post("/api/templates", request3, accessToken1);

            // find memberInfo
            MemberResponse member = get("/api/members/me", accessToken1)
                .extract()
                .as(MemberResponse.class);

            // when, then
            MyTemplatesResponse myTemplatesResponse = get("/api/templates?member=" + member.getSocialId(), accessToken1)
                .statusCode(HttpStatus.OK.value())
                .extract()
                .as(MyTemplatesResponse.class);

            assertAll(
                () -> assertThat(myTemplatesResponse.getNumberOfTemplates()).isEqualTo(2),
                () -> assertThat(myTemplatesResponse.getTemplates()).hasSize(2),
                () -> assertThat(myTemplatesResponse.getTemplates().get(0).getInfo().getTitle())
                    .isEqualTo(templateTitle3)
            );

        }

        @Test
        @DisplayName("로그인하지 않은 상태로 조회할 수 없다.")
        void withoutLogin() {
            get("/api/templates?member=12345").statusCode(HttpStatus.UNAUTHORIZED.value());
        }

        @Test
        @DisplayName("존재하지 않는 사용자에 대해 조회할 수 없다.")
        void invalidId() {
            get("/api/templates?member=12345", accessToken1).statusCode(HttpStatus.NOT_FOUND.value());
        }

    }

    @Nested
    @DisplayName("템플릿 수정")
    class updateTemplate {

        @Test
        @DisplayName("템플릿을 수정한다.")
        void updateTemplate() {
            // given
            long templateId = saveTemplateAndGetId(accessToken1);

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

            put("/api/templates/" + templateId, updateRequest, accessToken1).statusCode(HttpStatus.NO_CONTENT.value());
        }

        @Test
        @DisplayName("로그인하지 않은 상태로 템플릿을 수정할 수 없다.")
        void withoutLogin() {
            // given
            long templateId = saveTemplateAndGetId(accessToken1);

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

            put("/api/templates/" + templateId, updateRequest)
                .statusCode(HttpStatus.UNAUTHORIZED.value());
        }

        @Test
        @DisplayName("본인이 생성한 템플릿이 아니면 수정할 수 없다.")
        void notMine() {
            // given
            long templateId = saveTemplateAndGetId(accessToken1);

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

            put("/api/templates/" + templateId, updateRequest, accessToken2)
                .statusCode(HttpStatus.UNAUTHORIZED.value());
        }

        @Test
        @DisplayName("존재하지 않는 템플릿을 수정할 수 없다.")
        void invalidId() {
            // when, then
            put("/api/templates/" + 9999L, new TemplateUpdateRequest("title", "description", List.of()), accessToken1)
                .statusCode(HttpStatus.NOT_FOUND.value());
        }

    }

    @Nested
    @DisplayName("템플릿 삭제")
    class deleteTemplate {

        @Test
        @DisplayName("템플릿을 삭제한다.")
        void deleteTemplate() {
            // given
            long templateId = saveTemplateAndGetId(accessToken1);

            // when, then
            delete("/api/templates/" + templateId, accessToken1).statusCode(HttpStatus.NO_CONTENT.value());
        }

        @Test
        @DisplayName("로그인하지 않은 상태로 템플릿을 삭제할 수 없다.")
        void withoutLogin() {
            // given
            long templateId = saveTemplateAndGetId(accessToken1);

            // when, then
            delete("/api/templates/" + templateId).statusCode(HttpStatus.UNAUTHORIZED.value());
        }

        @Test
        @DisplayName("본인이 생성한 템플릿이 아니면 삭제할 수 없다.")
        void notMine() {
            // given
            long templateId = saveTemplateAndGetId(accessToken1);

            // when, then
            delete("/api/templates/" + templateId, accessToken2).statusCode(HttpStatus.UNAUTHORIZED.value());

        }

        @Test
        @DisplayName("존재하지 않는 템플릿을 삭제할 수 없다.")
        void invalidId() {
            // when, then
            delete("/api/templates/" + 9999L, accessToken1).statusCode(HttpStatus.NOT_FOUND.value());
        }

    }

    private long saveTemplateAndGetId(String accessToken) {
        String templateTitle = "title";
        String description = "test description";
        List<TemplateQuestionCreateRequest> questions = List.of(new TemplateQuestionCreateRequest("question1"),
            new TemplateQuestionCreateRequest("question2"));
        TemplateCreateRequest templateCreateRequest = new TemplateCreateRequest(templateTitle, description, questions);

        return post("/api/templates", templateCreateRequest, accessToken)
            .extract()
            .as(TemplateIdResponse.class)
            .getTemplateId();
    }
}
