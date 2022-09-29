package com.reviewduck.review.acceptance;

import static com.reviewduck.acceptance.TestPageConstant.*;
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
import com.reviewduck.member.service.MemberService;
import com.reviewduck.review.dto.request.AnswerCreateRequest;
import com.reviewduck.review.dto.request.ReviewContentCreateRequest;
import com.reviewduck.review.dto.request.ReviewCreateRequest;
import com.reviewduck.review.dto.request.ReviewFormCreateRequest;
import com.reviewduck.review.dto.request.ReviewFormQuestionCreateRequest;
import com.reviewduck.review.dto.request.ReviewFormQuestionUpdateRequest;
import com.reviewduck.review.dto.request.ReviewFormUpdateRequest;
import com.reviewduck.review.dto.response.ReviewFormCodeResponse;
import com.reviewduck.review.dto.response.ReviewFormResponse;
import com.reviewduck.template.dto.controller.request.TemplateCreateRequest;
import com.reviewduck.template.dto.controller.request.TemplateQuestionCreateRequest;
import com.reviewduck.template.dto.controller.response.TemplateIdResponse;

public class ReviewFormAcceptanceTest extends AcceptanceTest {

    private static final String invalidCode = "aaaaaaaa";
    private static final String invalidToken = "tokentokentoken.invalidinvalidinvalid.tokentokentoken";

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
    @DisplayName("회고 폼 생성")
    class createReviewForm {

        @Test
        @DisplayName("회고 폼을 생성한다.")
        void createReviewForm() {
            // given
            String reviewTitle = "title";
            List<ReviewFormQuestionCreateRequest> questions = List.of(
                new ReviewFormQuestionCreateRequest("question1", "description1"),
                new ReviewFormQuestionCreateRequest("question2", "description2"));
            ReviewFormCreateRequest request = new ReviewFormCreateRequest(reviewTitle, questions);

            // when, then
            post("/api/review-forms", request, accessToken1)
                .statusCode(HttpStatus.CREATED.value())
                .assertThat().body("reviewFormCode", notNullValue());
        }

        @Test
        @DisplayName("로그인하지 않은 상태로 생성할 수 없다.")
        void withoutLogin() {
            // given
            ReviewFormCreateRequest request = new ReviewFormCreateRequest("title", List.of());

            // when, then
            post("/api/review-forms", request).statusCode(HttpStatus.UNAUTHORIZED.value());
        }

    }

    @Nested
    @DisplayName("템플릿을 기반으로 작성된 후 수정된 회고 폼을 생성")
    class createReviewFormByTemplate {

        @Test
        void createReviewFormByTemplate() {
            // given
            // create template
            String templateTitle = "template title";
            String templateDescription = "template description";
            List<TemplateQuestionCreateRequest> templateQuestions = List.of(
                new TemplateQuestionCreateRequest("question1", "description1"),
                new TemplateQuestionCreateRequest("question2", "description2"));
            TemplateCreateRequest templateCreateRequest = new TemplateCreateRequest(templateTitle, templateDescription,
                templateQuestions);

            Long templateId = post("/api/templates", templateCreateRequest, accessToken1)
                .extract()
                .as(TemplateIdResponse.class)
                .getTemplateId();

            // when
            String reviewTitle = "title";
            List<ReviewFormQuestionCreateRequest> questions = List.of(
                new ReviewFormQuestionCreateRequest("question3", "description3"),
                new ReviewFormQuestionCreateRequest("question4", "description4"));
            ReviewFormCreateRequest reviewFormCreateRequest = new ReviewFormCreateRequest(reviewTitle, questions);

            // then
            post("/api/review-forms?templateId=" + templateId, reviewFormCreateRequest, accessToken1)
                .statusCode(HttpStatus.CREATED.value())
                .assertThat().body("reviewFormCode", notNullValue());
        }

        @Test
        @DisplayName("로그인하지 않은 상태로 생성할 수 없다.")
        void withoutLogin() {
            // given
            ReviewFormCreateRequest request = new ReviewFormCreateRequest("title", List.of());

            // when, then
            post("/api/review-forms?templateId=1", request).statusCode(HttpStatus.UNAUTHORIZED.value());
        }
    }

    @Nested
    @DisplayName("회고 답변 생성")
    class createReview {

        @Test
        @DisplayName("회고 답변을 생성한다.")
        void createReview() {
            // given
            String reviewTitle = "title";
            String code = createReviewFormAndGetCode(reviewTitle, accessToken1);

            // when, then
            // 질문조회
            assertReviewTitleFromFoundReviewForm(code, reviewTitle, accessToken1);

            // 리뷰생성
            ReviewCreateRequest createRequest = new ReviewCreateRequest(false, List.of(
                new ReviewContentCreateRequest(1L, new AnswerCreateRequest("answer1")),
                new ReviewContentCreateRequest(2L, new AnswerCreateRequest("answer2"))
            ));

            post("/api/review-forms/" + code, createRequest, accessToken1)
                .statusCode(HttpStatus.CREATED.value());
        }

        @Test
        @DisplayName("로그인하지 않은 상태로 회고 답변을 생성할 수 없다.")
        void withoutLogin() {
            // given
            String code = createReviewFormAndGetCode(accessToken1);

            // 리뷰생성
            ReviewCreateRequest createRequest = new ReviewCreateRequest(false, List.of(
                new ReviewContentCreateRequest(1L, new AnswerCreateRequest("answer1")),
                new ReviewContentCreateRequest(2L, new AnswerCreateRequest("answer2"))
            ));

            post("/api/review-forms/" + code, createRequest)
                .statusCode(HttpStatus.UNAUTHORIZED.value());
        }

        @Test
        @DisplayName("존재하지 않는 질문에 대해 답변을 작성하면 회고 작성에 실패한다.")
        void invalidQuestionId() {
            // given
            String reviewTitle = "title";
            String code = createReviewFormAndGetCode(reviewTitle, accessToken1);

            // when, then
            // 질문조회
            assertReviewTitleFromFoundReviewForm(code, reviewTitle, accessToken1);

            // 리뷰생성
            ReviewCreateRequest createRequest = new ReviewCreateRequest(false, List.of(
                new ReviewContentCreateRequest(888L, new AnswerCreateRequest("answer1")),
                new ReviewContentCreateRequest(999L, new AnswerCreateRequest("answer2"))
            ));

            post("/api/review-forms/" + code, createRequest, accessToken1)
                .statusCode(HttpStatus.NOT_FOUND.value());
        }

    }

    @Nested
    @DisplayName("특정 회고 폼 조회")
    class findReviewForm {

        @Test
        @DisplayName("특정 회고 폼을 조회한다.")
        void findReviewForm() {
            // given
            String reviewTitle = "title";
            String reviewFormCode = createReviewFormAndGetCode(reviewTitle, accessToken1);

            // when
            ReviewFormResponse response = get("/api/review-forms/" + reviewFormCode, accessToken1)
                .statusCode(HttpStatus.OK.value())
                .extract()
                .as(ReviewFormResponse.class);

            // then
            assertAll(
                () -> assertThat(response.getReviewFormTitle()).isEqualTo(reviewTitle),
                () -> assertThat(response.getQuestions()).hasSize(2)
            );
        }

        @Test
        @DisplayName("로그인하지 않은 상태로 조회할 수 없다.")
        void withoutLogin() {
            // given
            String reviewFormCode = createReviewFormAndGetCode(accessToken1);

            get("/api/review-forms/" + reviewFormCode).statusCode(HttpStatus.OK.value());
        }

        @Test
        @DisplayName("회고 폼이 존재하지 않는 경우 조회할 수 없다.")
        void invalidReviewForm() {
            // when, then
            get("/api/review-forms/" + "AAAAAAAA", accessToken1).statusCode(HttpStatus.NOT_FOUND.value());
        }

    }

    @Nested
    @DisplayName("사용자가 생성한 회고 폼 조회")
    class findReviewFormsByMember {

        @Test
        @DisplayName("파라미터가 없는 경우 페이지 기본값으로 조회한다.")
        void findPage() {
            // given
            // id 1~15 저장되고 6~15 최신 순으로 6~15 불러온다.
            for (int i = 0; i < DEFAULT_SIZE + 5; i++) {
                createReviewFormAndGetCode("reviewTitle", accessToken1);
            }
            createReviewFormAndGetCode("reviewTitle", accessToken2);

            // when, then
            get("/api/review-forms?member=1", accessToken1).statusCode(HttpStatus.OK.value())
                .assertThat().body("reviewForms", hasSize(DEFAULT_SIZE));
        }

        @Test
        @DisplayName("타인이 작성한 회고 질문지 중 최신순으로 첫 페이지를 조회한다.")
        void findPageOfMyReviewForms() {
            // given
            String reviewTitle1 = "title1";
            String reviewFormCode1 = createReviewFormAndGetCode(reviewTitle1, accessToken1);

            String reviewTitle2 = "title2";
            String reviewFormCode2 = createReviewFormAndGetCode(reviewTitle2, accessToken1);

            // when
            assertReviewTitleFromFoundReviewForm(reviewFormCode1, reviewTitle1, accessToken1);
            assertReviewTitleFromFoundReviewForm(reviewFormCode2, reviewTitle2, accessToken1);

            // then
            get("/api/review-forms?member=1&page=1&size=2", accessToken1)
                .statusCode(HttpStatus.OK.value())
                .assertThat()
                .body("isMine", equalTo(true))
                .body("reviewForms", hasSize(2))
                .body("reviewForms[0].title", equalTo(reviewTitle2))
                .body("isLastPage", equalTo(true));
        }

        @Test
        @DisplayName("자신이 작성한 회고 질문지 중 최신순으로 첫 페이지를 조회한다.")
        void findPageOfOtherReviewForms() {
            // given
            String reviewTitle1 = "title1";
            String reviewFormCode1 = createReviewFormAndGetCode(reviewTitle1, accessToken1);

            String reviewTitle2 = "title2";
            String reviewFormCode2 = createReviewFormAndGetCode(reviewTitle2, accessToken1);

            // when
            assertReviewTitleFromFoundReviewForm(reviewFormCode1, reviewTitle1, accessToken1);
            assertReviewTitleFromFoundReviewForm(reviewFormCode2, reviewTitle2, accessToken1);

            // then
            get("/api/review-forms?member=1&page=1&size=2", accessToken2)
                .statusCode(HttpStatus.OK.value())
                .assertThat()
                .body("isMine", equalTo(false))
                .body("reviewForms", hasSize(2))
                .body("reviewForms[0].title", equalTo(reviewTitle2))
                .body("isLastPage", equalTo(true));
        }

        @Test
        @DisplayName("로그인하지 않은 상태로 조회할 수 있다.")
        void withoutLogin() {
            get("/api/review-forms?member=1").statusCode(HttpStatus.OK.value());
        }

    }

    @Nested
    @DisplayName("특정 회고 폼을 기반으로 작성된 회고 조회")
    class findReviewsByCodeWithDisplayType {

        @Test
        @DisplayName("파라미터 값이 없으면 목록형으로 조회한다.")
        void withNoParam() {
            // given
            String code = createReviewFormAndGetCode(accessToken1);

            ReviewCreateRequest createRequest = new ReviewCreateRequest(false, List.of(
                new ReviewContentCreateRequest(1L, new AnswerCreateRequest("answer1")),
                new ReviewContentCreateRequest(2L, new AnswerCreateRequest("answer2"))
            ));

            post("/api/review-forms/" + code, createRequest, accessToken1);

            String newReviewTitle = "new title";
            List<ReviewFormQuestionUpdateRequest> updateQuestions = List.of(
                new ReviewFormQuestionUpdateRequest(1L, "new question1", "new description1"));
            ReviewFormUpdateRequest updateRequest = new ReviewFormUpdateRequest(newReviewTitle, updateQuestions);

            put("/api/review-forms/" + code, updateRequest, accessToken1);

            // when, then
            get("/api/review-forms/" + code + "/reviews?displayType=", accessToken1)
                .statusCode(HttpStatus.OK.value())
                .assertThat()
                .body("reviews", hasSize(1));
        }

        @Test
        @DisplayName("파라미터 값이 적절하지 않으면 목록형으로 조회한다.")
        void withInvalidParam() {
            // given
            String code = createReviewFormAndGetCode(accessToken1);

            ReviewCreateRequest createRequest = new ReviewCreateRequest(false, List.of(
                new ReviewContentCreateRequest(1L, new AnswerCreateRequest("answer1")),
                new ReviewContentCreateRequest(2L, new AnswerCreateRequest("answer2"))
            ));

            post("/api/review-forms/" + code, createRequest, accessToken1);

            String newReviewTitle = "new title";
            List<ReviewFormQuestionUpdateRequest> updateQuestions = List.of(
                new ReviewFormQuestionUpdateRequest(1L, "new question1", "new description1"));
            ReviewFormUpdateRequest updateRequest = new ReviewFormUpdateRequest(newReviewTitle, updateQuestions);

            put("/api/review-forms/" + code, updateRequest, accessToken1);

            // when, then
            get("/api/review-forms/" + code + "/reviews?displayType=wrong", accessToken1)
                .statusCode(HttpStatus.OK.value())
                .assertThat()
                .body("reviews", hasSize(1));
        }
    }

    @Nested
    @DisplayName("특정 회고 폼을 기반으로 작성된 목록형 회고 조회")
    class findReviewsByCodeWithListDisplay {

        @Test
        @DisplayName("파라미터가 없는 경우 기본값으로 조회한다.")
        void findAllReviewsByCode() {
            // given
            String code = createReviewFormAndGetCode(accessToken1);

            for (int i = 0; i < DEFAULT_SIZE + 5; i++) {
                createReview(code);
            }

            // when, then
            get("/api/review-forms/" + code + "/reviews?displayType=list", accessToken1)
                .statusCode(HttpStatus.OK.value())
                .assertThat()
                .body("numberOfReviews", equalTo(DEFAULT_SIZE + 5))
                .body("reviews", hasSize(DEFAULT_SIZE));
        }

        @Test
        @DisplayName("특정 회고 폼을 기반으로 작성된 회고 답변 전체 중 특정 페이지를 조회한다.")
        void findReviewsPageByCode() {
            // given
            String code = createReviewFormAndGetCode(accessToken1);

            createReview(code);
            createReview(code);

            // when, then
            get("/api/review-forms/" + code + "/reviews?page=1&size=1&displayType=list", accessToken1)
                .statusCode(HttpStatus.OK.value())
                .assertThat()
                .body("numberOfReviews", equalTo(2))
                .body("reviews", hasSize(1))
                .body("isLastPage", equalTo(false));
        }

        @Test
        @DisplayName("로그인하지 않은 상태로 조회할 수 있다.")
        void withoutLogin() {
            // given
            String code = createReviewFormAndGetCode(accessToken1);
            createReview(code);

            // when, then
            get("/api/review-forms/" + code + "/reviews?displayType=list")
                .statusCode(HttpStatus.OK.value())
                .assertThat()
                .body("reviews", hasSize(1));
        }

        @Test
        @DisplayName("잘못된 토큰 값으로 조회할 수 없다.")
        void withInvalidMember() {
            // given
            String code = createReviewFormAndGetCode(accessToken1);
            createReview(code);

            // when, then
            get("/api/review-forms/" + code + "/reviews?displayType=list", invalidToken)
                .statusCode(HttpStatus.UNAUTHORIZED.value());
        }

        @Test
        @DisplayName("존재하지 않는 회고 폼 코드에 대해 조회할 수 없다.")
        void invalidCode() {
            // when, then
            get("/api/review-forms/" + invalidCode + "/reviews?displayType=list", accessToken1)
                .statusCode(HttpStatus.NOT_FOUND.value());
        }

    }

    @Nested
    @DisplayName("특정 회고 폼을 기반으로 작성된 시트형 회고 조회 (동기화)")
    class findReviewsByCodeWithSheetDisplay {

        @Test
        @DisplayName("파라미터가 없는 경우 기본값으로 조회한다.")
        void findAllReviewsByCode() {
            // given
            String code = createReviewFormAndGetCode(accessToken1);

            for (int i = 0; i < DEFAULT_SIZE + 5; i++) {
                createReview(code);
            }

            // when, then
            get("/api/review-forms/" + code + "/reviews?displayType=sheet", accessToken1)
                .statusCode(HttpStatus.OK.value())
                .assertThat()
                .body("numberOfReviews", equalTo(DEFAULT_SIZE + 5))
                .body("reviews", hasSize(DEFAULT_SIZE));
        }

        @Test
        @DisplayName("특정 회고 폼을 기반으로 작성되고 동기화된 회고 답변중 특정 페이지를 조회한다.")
        void findReviewsByCode() {
            // given
            String code = createReviewFormAndGetCode(accessToken1);

            createReview(code);
            createReview(code);

            String newReviewTitle = "new title";
            List<ReviewFormQuestionUpdateRequest> updateQuestions = List.of(
                new ReviewFormQuestionUpdateRequest(1L, "new question1", "new description1"));
            ReviewFormUpdateRequest updateRequest = new ReviewFormUpdateRequest(newReviewTitle, updateQuestions);

            put("/api/review-forms/" + code, updateRequest, accessToken1);

            // when, then
            get("/api/review-forms/" + code + "/reviews?displayType=sheet&page=1&size=1", accessToken2)
                .statusCode(HttpStatus.OK.value())
                .assertThat()
                .body("numberOfReviews", equalTo(2))
                .body("isLastPage", equalTo(false));
        }

        @Test
        @DisplayName("로그인하지 않은 상태로 조회할 수 있다.")
        void withoutLogin() {
            // given
            String code = createReviewFormAndGetCode(accessToken1);
            createReview(code);

            // when, then
            get("/api/review-forms/" + code + "/reviews?displayType=sheet")
                .statusCode(HttpStatus.OK.value())
                .assertThat()
                .body("numberOfReviews", equalTo(1));
        }

        @Test
        @DisplayName("잘못된 토큰 값으로 조회할 수 없다.")
        void withInvalidMember() {
            // given
            String code = createReviewFormAndGetCode(accessToken1);
            createReview(code);

            // when, then
            get("/api/review-forms/" + code + "/reviews?displayType=sheet", invalidToken)
                .statusCode(HttpStatus.UNAUTHORIZED.value());
        }

        @Test
        @DisplayName("존재하지 않는 회고 폼 코드에 대해 조회할 수 없다.")
        void invalidCode() {
            // when, then
            get("/api/review-forms/" + invalidCode + "/reviews?displayType=sheet", accessToken1)
                .statusCode(HttpStatus.NOT_FOUND.value());
        }
    }

    @Nested
    @DisplayName("회고 폼 수정")
    class updateReviewForm {

        @Test
        @DisplayName("회고 폼을 수정한다.")
        void updateReviewForm() {
            // given
            String reviewFormCode = createReviewFormAndGetCode(accessToken1);

            // when, then
            String newReviewTitle = "new title";
            List<ReviewFormQuestionUpdateRequest> updateQuestions = List.of(
                new ReviewFormQuestionUpdateRequest(1L, "new question1", "new description1"));
            ReviewFormUpdateRequest updateRequest = new ReviewFormUpdateRequest(newReviewTitle, updateQuestions);

            put("/api/review-forms/" + reviewFormCode, updateRequest, accessToken1)
                .statusCode(HttpStatus.OK.value())
                .assertThat().body("reviewFormCode", equalTo(reviewFormCode));

            ReviewFormResponse getResponse = get("/api/review-forms/" + reviewFormCode, accessToken1)
                .extract()
                .as(ReviewFormResponse.class);

            assertAll(
                () -> assertThat(getResponse.getReviewFormTitle()).isEqualTo(newReviewTitle),
                () -> assertThat(getResponse.getQuestions()).hasSize(1),
                () -> assertThat(getResponse.getQuestions().get(0).getId()).isEqualTo(1L),
                () -> assertThat(getResponse.getQuestions().get(0).getValue()).isEqualTo("new question1"),
                () -> assertThat(getResponse.getQuestions().get(0).getDescription()).isEqualTo("new description1")
            );
        }

        @Test
        @DisplayName("로그인하지 않은 상태로 회고 폼을 수정할 수 없다.")
        void withoutLogin() {
            // given
            String createReviewFormCode = createReviewFormAndGetCode(accessToken1);

            // when, then
            String newReviewTitle = "new title";
            List<ReviewFormQuestionUpdateRequest> updateQuestions = List.of(
                new ReviewFormQuestionUpdateRequest(1L, "new question1", "new description1"));
            ReviewFormUpdateRequest updateRequest = new ReviewFormUpdateRequest(newReviewTitle, updateQuestions);

            put("/api/review-forms/" + createReviewFormCode, updateRequest)
                .statusCode(HttpStatus.UNAUTHORIZED.value());
        }

        @Test
        @DisplayName("존재하지 않는 회고 폼을 수정할 수 없다.")
        void invalidReviewForm() {
            // when, then
            String newReviewTitle = "new title";
            List<ReviewFormQuestionUpdateRequest> updateQuestions = List.of(
                new ReviewFormQuestionUpdateRequest(1L, "new question1", "new description1"));
            ReviewFormUpdateRequest updateRequest = new ReviewFormUpdateRequest(newReviewTitle, updateQuestions);

            put("/api/review-forms/aaaaaaaa", updateRequest, accessToken1)
                .statusCode(HttpStatus.NOT_FOUND.value());
        }

        @Test
        @DisplayName("본인이 생성한 회고 폼이 아니면 수정할 수 없다.")
        void notMine() {
            // given
            String createReviewFormCode = createReviewFormAndGetCode(accessToken1);

            // when, then
            String newReviewTitle = "new title";
            List<ReviewFormQuestionUpdateRequest> updateQuestions = List.of(
                new ReviewFormQuestionUpdateRequest(1L, "new question1", "new description1"));
            ReviewFormUpdateRequest updateRequest = new ReviewFormUpdateRequest(newReviewTitle, updateQuestions);

            // then
            put("/api/review-forms/" + createReviewFormCode, updateRequest, accessToken2)
                .statusCode(HttpStatus.UNAUTHORIZED.value());
        }

    }

    @Nested
    @DisplayName("회고 폼 삭제")
    class deleteReviewForm {

        @Test
        @DisplayName("회고 폼을 삭제한다.")
        void deleteReviewForm() {
            // given
            String createReviewFormCode = createReviewFormAndGetCode(accessToken1);

            // when, then
            delete("/api/review-forms/" + createReviewFormCode, accessToken1)
                .statusCode(HttpStatus.NO_CONTENT.value());

            get("/api/review-forms/" + createReviewFormCode, accessToken1)
                .statusCode(HttpStatus.NOT_FOUND.value());
        }

        @Test
        @DisplayName("로그인하지 않은 상태로 회고 폼을 삭제할 수 없다.")
        void withoutLogin() {
            // given
            String createReviewFormCode = createReviewFormAndGetCode(accessToken1);

            // when, then
            delete("/api/review-forms/" + createReviewFormCode)
                .statusCode(HttpStatus.UNAUTHORIZED.value());
        }

        @Test
        @DisplayName("존재하지 않는 회고 폼을 삭제할 수 없다.")
        void invalidReviewForm() {
            // when, then
            delete("/api/review-forms/aaaaaaaa", accessToken1)
                .statusCode(HttpStatus.NOT_FOUND.value());
        }

        @Test
        @DisplayName("본인이 생성한 회고 폼이 아니면 삭제할 수 없다.")
        void noeMine() {
            // given
            String createReviewFormCode = createReviewFormAndGetCode(accessToken1);

            // when, then
            delete("/api/review-forms/" + createReviewFormCode, accessToken2)
                .statusCode(HttpStatus.UNAUTHORIZED.value());
        }

    }

    private String createReviewFormAndGetCode(String accessToken) {
        return createReviewFormAndGetCode("title", accessToken);
    }

    private String createReviewFormAndGetCode(String reviewTitle, String accessToken) {
        List<ReviewFormQuestionCreateRequest> questions = List.of(
            new ReviewFormQuestionCreateRequest("question1", "description1"),
            new ReviewFormQuestionCreateRequest("question2", "description2"));

        ReviewFormCreateRequest request = new ReviewFormCreateRequest(reviewTitle, questions);

        return post("/api/review-forms", request, accessToken)
            .extract()
            .as(ReviewFormCodeResponse.class)
            .getReviewFormCode();
    }

    private void createReview(String reviewFormCode) {
        ReviewCreateRequest createRequest = new ReviewCreateRequest(false, List.of(
            new ReviewContentCreateRequest(1L, new AnswerCreateRequest("answer1")),
            new ReviewContentCreateRequest(2L, new AnswerCreateRequest("answer2"))
        ));
        post("/api/review-forms/" + reviewFormCode, createRequest, accessToken1);
    }

    private void assertReviewTitleFromFoundReviewForm(String code, String reviewTitle, String accessToken) {
        ReviewFormResponse reviewFormResponse = get("/api/review-forms/" + code, accessToken)
            .statusCode(HttpStatus.OK.value())
            .extract()
            .as(ReviewFormResponse.class);
        assertThat(reviewFormResponse.getReviewFormTitle()).isEqualTo(reviewTitle);
    }
}
