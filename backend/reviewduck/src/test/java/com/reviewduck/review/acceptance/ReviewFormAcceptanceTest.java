package com.reviewduck.review.acceptance;

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
import com.reviewduck.review.dto.response.MyReviewFormsResponse;
import com.reviewduck.review.dto.response.ReviewFormCodeResponse;
import com.reviewduck.review.dto.response.ReviewFormResponse;
import com.reviewduck.review.dto.response.ReviewResponse;

public class ReviewFormAcceptanceTest extends AcceptanceTest {

    private static final String invalidCode = "aaaaaaaa";

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
                new ReviewFormQuestionCreateRequest("question1"),
                new ReviewFormQuestionCreateRequest("question2"));
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
            ReviewCreateRequest createRequest = new ReviewCreateRequest(List.of(
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
            ReviewCreateRequest createRequest = new ReviewCreateRequest(List.of(
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
            ReviewCreateRequest createRequest = new ReviewCreateRequest(List.of(
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

            get("/api/review-forms/" + reviewFormCode).statusCode(HttpStatus.UNAUTHORIZED.value());
        }

        @Test
        @DisplayName("회고 폼이 존재하지 않는 경우 조회할 수 없다.")
        void invalidReviewForm() {
            // when, then
            get("/api/review-forms/" + "AAAAAAAA", accessToken1).statusCode(HttpStatus.NOT_FOUND.value());
        }

    }

    @Nested
    @DisplayName("자신이 생성한 회고 폼 조회")
    class findReviewFormsByMember {

        @Test
        @DisplayName("내가 생성한 회고 폼을 모두 조회한다.")
        void findAllMyReviewForms() {
            // given
            String reviewTitle1 = "title1";
            String reviewFormCode1 = createReviewFormAndGetCode(reviewTitle1, accessToken1);

            String reviewTitle2 = "title2";
            String reviewFormCode2 = createReviewFormAndGetCode(reviewTitle2, accessToken2);

            // when
            assertReviewTitleFromFoundReviewForm(reviewFormCode1, reviewTitle1, accessToken1);
            assertReviewTitleFromFoundReviewForm(reviewFormCode2, reviewTitle2, accessToken2);

            // then
            MyReviewFormsResponse myReviewFormsResponse = get("/api/review-forms/me", accessToken1).statusCode(
                    HttpStatus.OK.value())
                .assertThat()
                .body("reviewForms", hasSize(1))
                .extract()
                .as(MyReviewFormsResponse.class);

            assertThat(myReviewFormsResponse.getReviewForms().get(0).getTitle()).isEqualTo(reviewTitle1);
        }

        @Test
        @DisplayName("로그인하지 않은 상태로 조회할 수 없다.")
        void withoutLogin() {
            get("/api/review-forms/me").statusCode(HttpStatus.UNAUTHORIZED.value());
        }

    }

    @Nested
    @DisplayName("특정 회고 폼을 기반으로 작성된 회고 조회")
    class findReviewsByCode {

        @Test
        @DisplayName("특정 회고 폼을 기반으로 작성된 회고 답변 전체를 조회한다.")
        void findReviewsByCode() {
            // given
            String code = createReviewFormAndGetCode(accessToken1);

            ReviewCreateRequest createRequest = new ReviewCreateRequest(List.of(
                new ReviewContentCreateRequest(1L, new AnswerCreateRequest("answer1")),
                new ReviewContentCreateRequest(2L, new AnswerCreateRequest("answer2"))
            ));

            post("/api/review-forms/" + code, createRequest, accessToken1);

            // when
            List<ReviewResponse> response = get("/api/review-forms/" + code + "/reviews", accessToken1)
                .statusCode(HttpStatus.OK.value())
                .extract()
                .body()
                .jsonPath().getList(".", ReviewResponse.class);

            ReviewResponse reviewResponse = response.get(0);

            // then
            assertThat(reviewResponse.getContents()).hasSize(2);
        }

        @Test
        @DisplayName("로그인하지 않은 상태로 조회할 수 없다.")
        void withoutLogin() {
            // given
            String code = createReviewFormAndGetCode(accessToken1);

            ReviewCreateRequest createRequest = new ReviewCreateRequest(List.of(
                new ReviewContentCreateRequest(1L, new AnswerCreateRequest("answer1")),
                new ReviewContentCreateRequest(2L, new AnswerCreateRequest("answer2"))
            ));
            post("/api/review-forms/" + code, createRequest, accessToken1);

            // when, then
            get("/api/review-forms/" + code + "/reviews")
                .statusCode(HttpStatus.UNAUTHORIZED.value());
        }

        @Test
        @DisplayName("존재하지 않는 회고 폼 코드에 대해 조회할 수 없다.")
        void invalidCode() {
            // when, then
            get("/api/review-forms/" + invalidCode + "/reviews", accessToken1)
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
            String createReviewFormCode = createReviewFormAndGetCode(accessToken1);

            // when, then
            String newReviewTitle = "new title";
            List<ReviewFormQuestionUpdateRequest> updateQuestions = List.of(
                new ReviewFormQuestionUpdateRequest(1L, "new question1"));
            ReviewFormUpdateRequest updateRequest = new ReviewFormUpdateRequest(newReviewTitle, updateQuestions);

            put("/api/review-forms/" + createReviewFormCode, updateRequest, accessToken1)
                .statusCode(HttpStatus.OK.value())
                .assertThat().body("reviewFormCode", equalTo(createReviewFormCode));

            ReviewFormResponse getResponse = get("/api/review-forms/" + createReviewFormCode, accessToken1)
                .extract()
                .as(ReviewFormResponse.class);

            assertAll(
                () -> assertThat(getResponse.getReviewFormTitle()).isEqualTo(newReviewTitle),
                () -> assertThat(getResponse.getQuestions()).hasSize(1),
                () -> assertThat(getResponse.getQuestions().get(0).getId()).isEqualTo(1L),
                () -> assertThat(getResponse.getQuestions().get(0).getValue()).isEqualTo("new question1")
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
                new ReviewFormQuestionUpdateRequest(1L, "new question1"));
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
                new ReviewFormQuestionUpdateRequest(1L, "new question1"));
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
                new ReviewFormQuestionUpdateRequest(1L, "new question1"));
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
            new ReviewFormQuestionCreateRequest("question1"),
            new ReviewFormQuestionCreateRequest("question2"));

        ReviewFormCreateRequest request = new ReviewFormCreateRequest(reviewTitle, questions);

        return post("/api/review-forms", request, accessToken)
            .extract()
            .as(ReviewFormCodeResponse.class)
            .getReviewFormCode();
    }

    private void assertReviewTitleFromFoundReviewForm(String code, String reviewTitle, String accessToken) {
        ReviewFormResponse reviewFormResponse = get("/api/review-forms/" + code, accessToken)
            .statusCode(HttpStatus.OK.value())
            .extract()
            .as(ReviewFormResponse.class);
        assertThat(reviewFormResponse.getReviewFormTitle()).isEqualTo(reviewTitle);
    }
}
