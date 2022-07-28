package com.reviewduck.review.acceptance;

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
import com.reviewduck.review.dto.request.AnswerRequest;
import com.reviewduck.review.dto.request.ReviewFormCreateRequest;
import com.reviewduck.review.dto.request.ReviewFormQuestionRequest;
import com.reviewduck.review.dto.request.ReviewRequest;
import com.reviewduck.review.dto.response.ReviewFormCodeResponse;

public class ReviewAcceptanceTest extends AcceptanceTest {

    private static String accessToken1;
    private static String accessToken2;
    private final Long invalidReviewId = 99L;
    @Autowired
    private JwtTokenProvider jwtTokenProvider;
    @Autowired
    private MemberService memberService;

    @BeforeEach
    void createMemberAndGetAccessToken() {
        Member member1 = new Member("panda", "제이슨", "profileUrl1");
        memberService.save(member1);
        Member member2 = new Member("ariari", "브리", "profileUrl2");
        memberService.save(member2);
        accessToken1 = jwtTokenProvider.createToken("1");
        accessToken2 = jwtTokenProvider.createToken("2");
    }

    @Test
    @DisplayName("회고를 수정한다.")
    void editReview() {
        Long reviewId = saveReviewAndGetId(accessToken1);

        //when, then
        ReviewRequest editRequest = new ReviewRequest("제이슨",
            List.of(new AnswerRequest(1L, "editedAnswer1"), new AnswerRequest(2L, "editedAnswer2")));

        put("/api/reviews/" + reviewId, editRequest, accessToken1)
            .statusCode(HttpStatus.NO_CONTENT.value());
    }

    @Test
    @DisplayName("존재하지 않는 회고를 수정할 수 없다.")
    void failToEditReview() {
        // when, then
        ReviewRequest createRequest = new ReviewRequest("제이슨",
            List.of(new AnswerRequest(1L, "answer1"), new AnswerRequest(2L, "answer2")));
        put("/api/reviews/" + invalidReviewId, createRequest, accessToken1)
            .statusCode(HttpStatus.NOT_FOUND.value());
    }

    @Test
    @DisplayName("회고를 삭제한다.")
    void deleteReview() {
        // given
        String reviewTitle = "title";
        List<ReviewFormQuestionRequest> questions = List.of(new ReviewFormQuestionRequest("question1"),
            new ReviewFormQuestionRequest("question2"));
        String code = createReviewFormAndGetCode(accessToken1, reviewTitle, questions);
        ReviewRequest createRequest = new ReviewRequest("제이슨",
            List.of(new AnswerRequest(1L, "answer1"), new AnswerRequest(2L, "answer2")));
        post("/api/review-forms/" + code, createRequest, accessToken1);

        Long reviewId = saveReviewAndGetId(accessToken1);

        //when, then
        delete("/api/reviews/" + reviewId, accessToken1)
            .statusCode(HttpStatus.NO_CONTENT.value());
    }

    @Test
    @DisplayName("존재하지 않는 회고를 삭제할 수 없다.")
    void failToDeleteReview() {
        // when, then
        delete("/api/reviews/" + invalidReviewId, accessToken1)
            .statusCode(HttpStatus.NOT_FOUND.value());
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

    private String createReviewFormAndGetCode(String accessToken, String reviewTitle, List<ReviewFormQuestionRequest> questions) {
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
        List<ReviewFormQuestionRequest> questions = List.of(new ReviewFormQuestionRequest("question1"),
            new ReviewFormQuestionRequest("question2"));
        String code = createReviewFormAndGetCode(accessToken, reviewTitle, questions);
        ReviewRequest createRequest = new ReviewRequest("제이슨",
            List.of(new AnswerRequest(1L, "answer1"), new AnswerRequest(2L, "answer2")));
        post("/api/review-forms/" + code, createRequest, accessToken);

        return get("/api/review-forms/" + code + "/reviews", accessToken)
            .extract()
            .as(ReviewsFindResponse.class).getReviews()
            .get(0)
            .getReviewId();
    }
}
