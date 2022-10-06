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
import com.reviewduck.review.dto.controller.request.AnswerCreateRequest;
import com.reviewduck.review.dto.controller.request.AnswerUpdateRequest;
import com.reviewduck.review.dto.controller.request.ReviewContentCreateRequest;
import com.reviewduck.review.dto.controller.request.ReviewContentUpdateRequest;
import com.reviewduck.review.dto.controller.request.ReviewCreateRequest;
import com.reviewduck.review.dto.controller.request.ReviewFormCreateRequest;
import com.reviewduck.review.dto.controller.request.ReviewFormQuestionCreateRequest;
import com.reviewduck.review.dto.controller.request.ReviewFormQuestionUpdateRequest;
import com.reviewduck.review.dto.controller.request.ReviewFormUpdateRequest;
import com.reviewduck.review.dto.controller.request.ReviewLikesRequest;
import com.reviewduck.review.dto.controller.request.ReviewUpdateRequest;
import com.reviewduck.review.dto.controller.response.ReviewContentResponse;
import com.reviewduck.review.dto.controller.response.ReviewFormCodeResponse;
import com.reviewduck.review.dto.controller.response.ReviewSynchronizedResponse;

public class ReviewAcceptanceTest extends AcceptanceTest {

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
    @DisplayName("최신화된 회고 폼과 동기화하여 특정 회고 조회")
    class findReview {

        @Test
        @DisplayName("최신화된 회고폼과 동기화하여 특정 회고를 조회한다.")
        void findReview() {
            // save reviewForm
            String reviewTitle = "title";
            List<ReviewFormQuestionCreateRequest> questions = List.of(
                new ReviewFormQuestionCreateRequest("question1", "description1"),
                new ReviewFormQuestionCreateRequest("question2", "description2"),
                new ReviewFormQuestionCreateRequest("question3", "description3"));
            String code = createReviewFormAndGetCode(accessToken1, reviewTitle, questions);

            // save review
            ReviewCreateRequest createRequest = new ReviewCreateRequest(false, List.of(
                new ReviewContentCreateRequest(1L, new AnswerCreateRequest("answer1")),
                new ReviewContentCreateRequest(2L, new AnswerCreateRequest("answer2")),
                new ReviewContentCreateRequest(3L, new AnswerCreateRequest("answer3"))
            ));

            post("/api/review-forms/" + code, createRequest, accessToken2);

            // delete question2 and add question4 of reviewForm
            List<ReviewFormQuestionUpdateRequest> updateQuestions = List.of(
                new ReviewFormQuestionUpdateRequest(1L, "new question1", "new description1"),
                new ReviewFormQuestionUpdateRequest(3L, "new question3", "new description3"),
                new ReviewFormQuestionUpdateRequest(null, "new question4", "new description4"));
            ReviewFormUpdateRequest updateRequest = new ReviewFormUpdateRequest(reviewTitle, updateQuestions);
            put("/api/review-forms/" + code, updateRequest, accessToken1);

            //when
            List<ReviewContentResponse> actual = get("/api/reviews/1", accessToken1)
                .statusCode(HttpStatus.OK.value())
                .extract()
                .as(ReviewSynchronizedResponse.class)
                .getContents();

            // then
            assertAll(
                () -> assertThat(actual.size()).isEqualTo(3),
                () -> assertThat(actual.get(0).getQuestion().getValue()).isEqualTo("new question1"),
                () -> assertThat(actual.get(0).getAnswer().getId()).isEqualTo(1L),
                () -> assertThat(actual.get(1).getQuestion().getValue()).isEqualTo("new question3"),
                () -> assertThat(actual.get(1).getAnswer().getId()).isEqualTo(3L),
                () -> assertThat(actual.get(2).getQuestion().getValue()).isEqualTo("new question4"),
                () -> assertThat(actual.get(2).getAnswer()).isEqualTo(null)
            );
        }

        @Test
        @DisplayName("로그인하지 않은 상태로 특정 회고를 조회할 수 없다")
        void withoutLogin() {
            Long reviewId = saveReviewAndGetId(accessToken1, false);

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
    @DisplayName("사용자가 작성한 회고 조회")
    class findMemberReview {

        @Test
        @DisplayName("파라미터가 없는 경우 페이지 기본값으로 조회한다.")
        void findPage() {
            // given
            // id 1~15 저장되고 6~15 최신 순으로 6~15 불러온다.
            for (int i = 0; i < DEFAULT_SIZE + 5; i++) {
                saveReviewAndGetId(accessToken1, false);
            }
            saveReviewAndGetId(accessToken2, false);

            // when, then
            get("/api/reviews?member=1", accessToken1).statusCode(HttpStatus.OK.value())
                .assertThat().body("reviews", hasSize(DEFAULT_SIZE))
                .assertThat().body("reviews[0].id", equalTo(15));
        }

        @Test
        @DisplayName("자신이 작성한 회고중 최신순으로 특정 페이지를 조회한다.")
        void findPageOfMyReviews() {
            // given
            saveReviewAndGetId(accessToken1, false);
            saveReviewAndGetId(accessToken1, false);

            get("/api/reviews?member=1&page=2&size=1", accessToken1)
                .statusCode(HttpStatus.OK.value())
                .assertThat()
                .body("isMine", equalTo(true))
                .body("reviews", hasSize(1))
                .body("numberOfReviews", equalTo(2))
                .body("reviews[0].id", equalTo(1))
                .body("isLastPage", equalTo(true));

        }

        @Test
        @DisplayName("타인이 작성한 회고중 비공개 회고가 아닌 것만 최신순으로 특정 페이지를 조회한다.")
        void findPageOfOtherReviews() {
            // given
            // id 1~3 저장. 2~3을 불러온다.
            saveReviewAndGetId(accessToken1, true);
            saveReviewAndGetId(accessToken1, false);
            saveReviewAndGetId(accessToken1, false);

            get("/api/reviews?member=1&page=1&size=3", accessToken2)
                .statusCode(HttpStatus.OK.value())
                .assertThat()
                .body("isMine", equalTo(false))
                .body("reviews", hasSize(2))
                .body("numberOfReviews", equalTo(2))
                .body("reviews[0].id", equalTo(3))
                .body("isLastPage", equalTo(true));
        }

        @Test
        @DisplayName("특정 회고 폼을 삭제해도 자신이 작성한 회고를 조회할 수 있다.")
        void findPageOfReviewsByDeletedSpecificReviewForm() {
            // given
            // 회고 폼 등록
            List<ReviewFormQuestionCreateRequest> questions = List.of(
                new ReviewFormQuestionCreateRequest("question1", "description1"),
                new ReviewFormQuestionCreateRequest("question2", "description2"));
            String reviewFormCode = createReviewFormAndGetCode(accessToken1, "title", questions);

            // 회고 등록
            ReviewCreateRequest createRequest = new ReviewCreateRequest(false, List.of(
                new ReviewContentCreateRequest(1L, new AnswerCreateRequest("answer1")),
                new ReviewContentCreateRequest(2L, new AnswerCreateRequest("answer2"))
            ));
            post("/api/review-forms/" + reviewFormCode, createRequest, accessToken1);

            // when
            delete("/api/review-forms/" + reviewFormCode, accessToken1);

            // then
            get("/api/reviews?member=1", accessToken1)
                .statusCode(HttpStatus.OK.value())
                .assertThat()
                .body("reviews", hasSize(1))
                .body("numberOfReviews", equalTo(1));
        }

        @Test
        @DisplayName("로그인하지 않은 상태로 사용자가 작성한 회고를 모두 조회할 수 있다")
        void withoutLogin() {
            get("/api/reviews?member=1").statusCode(HttpStatus.OK.value());
        }

    }

    @Nested
    @DisplayName("타임라인 회고 조회")
    class findTimelineReview {

        @Test
        @DisplayName("파라미터가 없는 경우 기본값으로 조회한다.")
        void findAllReviews() {
            // given
            for (int i = 0; i < DEFAULT_SIZE + 5; i++) {
                saveReviewAndGetId(accessToken1, false);
            }

            int reviewId = saveReviewAndGetId(accessToken1, false).intValue();

            ReviewLikesRequest request = new ReviewLikesRequest(50);
            post("api/reviews/" + reviewId + "/likes", request);

            saveReviewAndGetId(accessToken1, true);

            get("/api/reviews/public")
                .statusCode(HttpStatus.OK.value())
                .assertThat()
                .body("numberOfReviews", equalTo(DEFAULT_SIZE + 6))
                .body("reviews", hasSize(DEFAULT_SIZE))
                .body("reviews[0].id", equalTo(reviewId));
        }

        @Test
        @DisplayName("최신순으로 특정 페이지를 조회한다.")
        void findPageOrderByLatest() {
            saveReviewAndGetId(accessToken1, false);
            int reviewId = saveReviewAndGetId(accessToken2, false).intValue();
            saveReviewAndGetId(accessToken2, true);

            ReviewLikesRequest request = new ReviewLikesRequest(50);
            post("api/reviews/" + reviewId + "/likes", request);

            get("/api/reviews/public?page=1&size=1&sort=latest")
                .statusCode(HttpStatus.OK.value())
                .assertThat()
                .body("numberOfReviews", equalTo(2))
                .body("reviews", hasSize(1))
                .body("reviews[0].id", equalTo(reviewId))
                .body("isLastPage", equalTo(false));
        }

        @Test
        @DisplayName("인기순으로 특정 페이지를 조회한다.")
        void findPageOrderByTrend() {
            saveReviewAndGetId(accessToken1, false);
            int reviewId = saveReviewAndGetId(accessToken2, false).intValue();
            saveReviewAndGetId(accessToken2, true);

            get("/api/reviews/public?page=1&size=1&sort=latest")
                .statusCode(HttpStatus.OK.value())
                .assertThat()
                .body("numberOfReviews", equalTo(2))
                .body("reviews", hasSize(1))
                .body("reviews[0].id", equalTo(reviewId))
                .body("isLastPage", equalTo(false));
        }

        @Test
        @DisplayName("로그인하지 않은 상태로 조회할 수 있다.")
        void withoutLogin() {
            get("/api/reviews/public").statusCode(HttpStatus.OK.value());
        }

    }

    @Nested
    @DisplayName("회고 수정")
    class updateReview {

        @Test
        @DisplayName("회고를 수정한다.")
        void updateReview() {
            Long reviewId = saveReviewAndGetId(accessToken1, false);

            //when, then
            ReviewUpdateRequest updateRequest = new ReviewUpdateRequest(false, List.of(
                new ReviewContentUpdateRequest(1L, new AnswerUpdateRequest("editedAnswer1")),
                new ReviewContentUpdateRequest(2L, new AnswerUpdateRequest("editedAnswer2"))
            ));

            put("/api/reviews/" + reviewId, updateRequest, accessToken1)
                .statusCode(HttpStatus.NO_CONTENT.value());
        }

        @Test
        @DisplayName("로그인하지 않은 상태로 회고를 수정할 수 없다")
        void withoutLogin() {
            Long reviewId = saveReviewAndGetId(accessToken1, false);

            //when, then
            ReviewUpdateRequest updateRequest = new ReviewUpdateRequest(false, List.of(
                new ReviewContentUpdateRequest(1L, new AnswerUpdateRequest("editedAnswer1")),
                new ReviewContentUpdateRequest(2L, new AnswerUpdateRequest( "editedAnswer2"))
            ));

            put("/api/reviews/" + reviewId, updateRequest)
                .statusCode(HttpStatus.UNAUTHORIZED.value());
        }

        @Test
        @DisplayName("존재하지 않는 회고를 수정할 수 없다.")
        void invalidReviewId() {
            // when, then
            ReviewUpdateRequest updateRequest = new ReviewUpdateRequest(false, List.of(
                new ReviewContentUpdateRequest(1L, new AnswerUpdateRequest("editedAnswer1")),
                new ReviewContentUpdateRequest(2L,new AnswerUpdateRequest("editedAnswer2"))
            ));

            put("/api/reviews/" + invalidReviewId, updateRequest, accessToken1)
                .statusCode(HttpStatus.NOT_FOUND.value());
        }

        @Test
        @DisplayName("본인이 생성한 회고가 아니면 수정할 수 없다.")
        void notMine() {
            Long reviewId = saveReviewAndGetId(accessToken1, false);

            //when, then
            ReviewUpdateRequest updateRequest = new ReviewUpdateRequest(false, List.of(
                new ReviewContentUpdateRequest(1L, new AnswerUpdateRequest("editedAnswer1")),
                new ReviewContentUpdateRequest(2L,new AnswerUpdateRequest("editedAnswer2"))
            ));

            put("/api/reviews/" + reviewId, updateRequest, accessToken2)
                .statusCode(HttpStatus.UNAUTHORIZED.value());
        }

    }

    @Nested
    @DisplayName("회고 삭제")
    class deleteReview {

        @Test
        @DisplayName("회고를 삭제한다.")
        void deleteReview() {
            Long reviewId = saveReviewAndGetId(accessToken1, false);

            //when, then
            delete("/api/reviews/" + reviewId, accessToken1)
                .statusCode(HttpStatus.NO_CONTENT.value());
        }

        @Test
        @DisplayName("로그인하지 않은 상태로 회고를 삭제할 수 없다")
        void withoutLogin() {
            // given
            Long reviewId = saveReviewAndGetId(accessToken1, false);

            //when, then
            delete("/api/reviews/" + reviewId)
                .statusCode(HttpStatus.UNAUTHORIZED.value());
        }

        @Test
        @DisplayName("존재하지 않는 회고를 삭제할 수 없다.")
        void invalidReviewId() {
            // when, then
            delete("/api/reviews/" + invalidReviewId, accessToken1)
                .statusCode(HttpStatus.NOT_FOUND.value());
        }

        @Test
        @DisplayName("본인이 생성한 회고가 아니면 삭제할 수 없다.")
        void notMine() {
            // given
            Long reviewId = saveReviewAndGetId(accessToken1, false);

            //when, then
            delete("/api/reviews/" + reviewId, accessToken2)
                .statusCode(HttpStatus.UNAUTHORIZED.value());
        }

    }

    @Nested
    @DisplayName("좋아요")
    class likes {

        @Test
        @DisplayName("좋아요를 더한다.")
        void increase() {
            // given
            Long reviewId = saveReviewAndGetId(accessToken1, false);
            ReviewLikesRequest request = new ReviewLikesRequest(50);

            // when, then
            // 50번씩 두 번 더한다.
            post("api/reviews/" + reviewId + "/likes", request)
                .statusCode(HttpStatus.OK.value())
                .assertThat()
                .body("likes", equalTo(50));

            post("api/reviews/" + reviewId + "/likes", request)
                .statusCode(HttpStatus.OK.value())
                .assertThat()
                .body("likes", equalTo(100));
        }
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

    private Long saveReviewAndGetId(String accessToken, boolean isPrivate) {
        // save ReviewForm
        String reviewTitle = "title";
        List<ReviewFormQuestionCreateRequest> questions = List.of(
            new ReviewFormQuestionCreateRequest("question1", "description1"),
            new ReviewFormQuestionCreateRequest("question2", "description2"));
        String code = createReviewFormAndGetCode(accessToken, reviewTitle, questions);

        // save Review
        ReviewCreateRequest createRequest = new ReviewCreateRequest(isPrivate, List.of(
            new ReviewContentCreateRequest(1L, new AnswerCreateRequest("answer1")),
            new ReviewContentCreateRequest(2L, new AnswerCreateRequest("answer2"))
        ));

        post("/api/review-forms/" + code, createRequest, accessToken);

        return get("/api/review-forms/" + code + "/reviews?displayType=list",
            accessToken)
            .extract()
            .body()
            .jsonPath()
            .getLong("reviews[0].id");
    }
}
