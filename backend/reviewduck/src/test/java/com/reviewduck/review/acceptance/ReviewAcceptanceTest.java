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
import com.reviewduck.review.dto.request.AnswerRequest;
import com.reviewduck.review.dto.request.AnswerUpdateRequest;
import com.reviewduck.review.dto.request.ReviewFormCreateRequest;
import com.reviewduck.review.dto.request.ReviewFormQuestionCreateRequest;
import com.reviewduck.review.dto.request.ReviewFormQuestionUpdateRequest;
import com.reviewduck.review.dto.request.ReviewFormUpdateRequest;
import com.reviewduck.review.dto.request.ReviewRequest;
import com.reviewduck.review.dto.request.ReviewUpdateRequest;
import com.reviewduck.review.dto.response.QuestionAnswerResponse;
import com.reviewduck.review.dto.response.ReviewFormCodeResponse;
import com.reviewduck.review.dto.response.ReviewSummaryResponse;
import com.reviewduck.review.dto.response.ReviewsResponse;

public class ReviewAcceptanceTest extends AcceptanceTest {

    private static final Long invalidReviewId = 99L;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;
    @Autowired
    private MemberService memberService;

    private String accessToken1;
    private String accessToken2;

    @BeforeEach
    void createMemberAndGetAccessToken() {
        Member member1 = new Member("1", "jason", "제이슨", "profileUrl1");
        Member savedMember1 = memberService.save(member1);

        Member member2 = new Member("2", "woni", "워니", "profileUrl2");
        Member savedMember2 = memberService.save(member2);

        accessToken1 = jwtTokenProvider.createAccessToken(String.valueOf(savedMember1.getId()));
        accessToken2 = jwtTokenProvider.createAccessToken(String.valueOf(savedMember2.getId()));
    }

    @Nested
    @DisplayName("특정 회고 조회")
    class findReview {

        @Test
        @DisplayName("특정 회고를 조회한다.")
        void findReview() {
            Long reviewId = saveReviewAndGetId(accessToken1);

            //when, then
            get("/api/reviews/" + reviewId, accessToken1)
                .statusCode(HttpStatus.OK.value());
        }

        @Test
        @DisplayName("로그인하지 않은 상태로 특정 회고를 조회할 수 없다")
        void withoutLogin() {
            Long reviewId = saveReviewAndGetId(accessToken1);

            //when, then
            get("/api/reviews/" + reviewId)
                .statusCode(HttpStatus.UNAUTHORIZED.value());
        }

        @Test
        @DisplayName("존재하지 않는 회고를 조회할 수 없다.")
        void invalidReview() {
            // when, then
            get("/api/reviews/999999", accessToken1)
                .statusCode(HttpStatus.NOT_FOUND.value());
        }

    }

    @Nested
    @DisplayName("최신화된 회고 폼과 동기화하여 특정 회고 조회")
    class findSynchronizedReview {

        @Test
        @DisplayName("최신화된 회고폼과 동기화하여 특정 회고를 조회한다.")
        void findSynchronizedReview() {
            // save reviewForm
            String reviewTitle = "title";
            List<ReviewFormQuestionCreateRequest> questions = List.of(
                new ReviewFormQuestionCreateRequest("question1"),
                new ReviewFormQuestionCreateRequest("question2"),
                new ReviewFormQuestionCreateRequest("question3"));
            String code = createReviewFormAndGetCode(accessToken1, reviewTitle, questions);

            // save review
            ReviewRequest createRequest = new ReviewRequest(
                List.of(new AnswerRequest(1L, "answer1"),
                    new AnswerRequest(2L, "answer2"),
                    new AnswerRequest(3L, "answer3")));
            post("/api/review-forms/" + code, createRequest, accessToken2);

            // delete question2 and add question4 of reviewForm
            List<ReviewFormQuestionUpdateRequest> updateQuestions = List.of(
                new ReviewFormQuestionUpdateRequest(1L, "new question1"),
                new ReviewFormQuestionUpdateRequest(3L, "new question3"),
                new ReviewFormQuestionUpdateRequest(null, "new question4"));
            ReviewFormUpdateRequest updateRequest = new ReviewFormUpdateRequest(reviewTitle, updateQuestions);
            put("/api/review-forms/" + code, updateRequest, accessToken1);

            //when
            List<QuestionAnswerResponse> actual = get("/api/reviews/1/synchronized", accessToken1)
                .statusCode(HttpStatus.OK.value())
                .extract()
                .as(ReviewSummaryResponse.class)
                .getAnswers();

            // then
            assertAll(
                () -> assertThat(actual.size()).isEqualTo(3),
                () -> assertThat(actual.get(0).getQuestionValue()).isEqualTo("new question1"),
                () -> assertThat(actual.get(0).getAnswerId()).isEqualTo(1L),
                () -> assertThat(actual.get(1).getQuestionValue()).isEqualTo("new question3"),
                () -> assertThat(actual.get(1).getAnswerId()).isEqualTo(3L),
                () -> assertThat(actual.get(2).getQuestionValue()).isEqualTo("new question4"),
                () -> assertThat(actual.get(2).getAnswerId()).isEqualTo(null)
            );
        }

        @Test
        @DisplayName("로그인하지 않은 상태로 조회할 수 없다")
        void withoutLogin() {
            Long reviewId = saveReviewAndGetId(accessToken1);

            //when, then
            get("/api/reviews/" + reviewId + "/synchronized")
                .statusCode(HttpStatus.UNAUTHORIZED.value());
        }

        @Test
        @DisplayName("존재하지 않는 회고를 조회할 수 없다.")
        void invalidReview() {
            // when, then
            get("/api/reviews/999999/synchronized", accessToken1)
                .statusCode(HttpStatus.NOT_FOUND.value());
        }

    }

    @Test
    @DisplayName("회고를 수정한다.")
    void editReview() {
        Long reviewId = saveReviewAndGetId(accessToken1);

        //when, then
        ReviewUpdateRequest editRequest = new ReviewUpdateRequest(
            List.of(new AnswerUpdateRequest(1L, 1L, "editedAnswer1"),
                new AnswerUpdateRequest(2L, 2L, "editedAnswer2")));

        put("/api/reviews/" + reviewId, editRequest, accessToken1)
            .statusCode(HttpStatus.NO_CONTENT.value());
    }

    @Test
    @DisplayName("로그인하지 않은 상태로 회고를 수정할 수 없다")
    void failToEditReviewWithoutLogin() {
        Long reviewId = saveReviewAndGetId(accessToken1);

        //when, then
        ReviewUpdateRequest editRequest = new ReviewUpdateRequest(
            List.of(new AnswerUpdateRequest(1L, 1L, "editedAnswer1"),
                new AnswerUpdateRequest(2L, 2L, "editedAnswer2")));

        put("/api/reviews/" + reviewId, editRequest)
            .statusCode(HttpStatus.UNAUTHORIZED.value());
    }

    @Test
    @DisplayName("존재하지 않는 회고를 수정할 수 없다.")
    void failToEditReview() {
        // when, then
        ReviewUpdateRequest editRequest = new ReviewUpdateRequest(
            List.of(new AnswerUpdateRequest(1L, 1L, "editedAnswer1"),
                new AnswerUpdateRequest(2L, 2L, "editedAnswer2")));

        put("/api/reviews/" + invalidReviewId, editRequest, accessToken1)
            .statusCode(HttpStatus.NOT_FOUND.value());
    }

    @Test
    @DisplayName("본인이 생성한 회고가 아니면 수정할 수 없다.")
    void failToEditNotMyReview() {
        Long reviewId = saveReviewAndGetId(accessToken1);

        //when, then
        ReviewUpdateRequest editRequest = new ReviewUpdateRequest(
            List.of(new AnswerUpdateRequest(1L, 1L, "editedAnswer1"),
                new AnswerUpdateRequest(2L, 2L, "editedAnswer2")));

        put("/api/reviews/" + reviewId, editRequest, accessToken2)
            .statusCode(HttpStatus.UNAUTHORIZED.value());
    }

    @Test
    @DisplayName("회고를 삭제한다.")
    void deleteReview() {
        Long reviewId = saveReviewAndGetId(accessToken1);

        //when, then
        delete("/api/reviews/" + reviewId, accessToken1)
            .statusCode(HttpStatus.NO_CONTENT.value());
    }

    @Test
    @DisplayName("로그인하지 않은 상태로 회고를 삭제할 수 없다")
    void failToDeleteReviewWithoutLogin() {
        // given
        Long reviewId = saveReviewAndGetId(accessToken1);

        //when, then
        delete("/api/reviews/" + reviewId)
            .statusCode(HttpStatus.UNAUTHORIZED.value());
    }

    @Test
    @DisplayName("존재하지 않는 회고를 삭제할 수 없다.")
    void failToDeleteReview() {
        // when, then
        delete("/api/reviews/" + invalidReviewId, accessToken1)
            .statusCode(HttpStatus.NOT_FOUND.value());
    }

    @Test
    @DisplayName("본인이 생성한 회고가 아니면 삭제할 수 없다.")
    void failToDeleteNotMyReview() {
        // given
        Long reviewId = saveReviewAndGetId(accessToken1);

        //when, then
        delete("/api/reviews/" + reviewId, accessToken2)
            .statusCode(HttpStatus.UNAUTHORIZED.value());
    }

    @Test
    @DisplayName("내가 작성한 회고를 모두 조회한다.")
    void findAllMyReviews() {
        // given
        saveReviewAndGetId(accessToken1);
        saveReviewAndGetId(accessToken2);

        get("/api/reviews/me", accessToken1)
            .statusCode(HttpStatus.OK.value())
            .assertThat()
            .body("reviews", hasSize(1))
            .body("numberOfReviews", equalTo(1));
    }

    @Test
    @DisplayName("특정 회고 폼을 삭제해도 본인이 작성한 회고를 조회할 수 있다.")
    void findReviewsByDeletedSpecificReviewForm() {
        // given
        // 회고 폼 등록
        List<ReviewFormQuestionCreateRequest> questions = List.of(
            new ReviewFormQuestionCreateRequest("question1"),
            new ReviewFormQuestionCreateRequest("question2"));
        String reviewFormCode = createReviewFormAndGetCode(accessToken1, "title", questions);

        // 회고 등록
        ReviewRequest createRequest = new ReviewRequest(
            List.of(new AnswerRequest(1L, "answer1"), new AnswerRequest(2L, "answer2")));
        post("/api/review-forms/" + reviewFormCode, createRequest, accessToken1);

        // when
        delete("/api/review-forms/" + reviewFormCode, accessToken1);

        // then
        get("/api/reviews/me", accessToken1)
            .statusCode(HttpStatus.OK.value())
            .assertThat()
            .body("reviews", hasSize(1))
            .body("numberOfReviews", equalTo(1));
    }

    @Test
    @DisplayName("로그인하지 않은 상태로 내가 작성한 회고를 모두 조회할 수 없다")
    void failToFindAllMyReviewsWithoutLogin() {
        get("/api/reviews/me").statusCode(HttpStatus.UNAUTHORIZED.value());
    }

    private String createReviewFormAndGetCode(String accessToken, String reviewTitle,
        List<ReviewFormQuestionCreateRequest> questions) {
        // given
        ReviewFormCreateRequest request = new ReviewFormCreateRequest(reviewTitle, questions);

        // when, then
        return post("/api/review-forms", request, accessToken)
            .extract()
            .as(ReviewFormCodeResponse.class)
            .getReviewFormCode();
    }

    private Long saveReviewAndGetId(String accessToken) {
        String reviewTitle = "title";
        List<ReviewFormQuestionCreateRequest> questions = List.of(
            new ReviewFormQuestionCreateRequest("question1"),
            new ReviewFormQuestionCreateRequest("question2"));
        String code = createReviewFormAndGetCode(accessToken, reviewTitle, questions);
        ReviewRequest createRequest = new ReviewRequest(
            List.of(new AnswerRequest(1L, "answer1"), new AnswerRequest(2L, "answer2")));
        post("/api/review-forms/" + code, createRequest, accessToken);

        return get("/api/review-forms/" + code + "/reviews", accessToken)
            .extract()
            .as(ReviewsResponse.class)
            .getReviews()
            .get(0)
            .getReviewId();
    }
}
