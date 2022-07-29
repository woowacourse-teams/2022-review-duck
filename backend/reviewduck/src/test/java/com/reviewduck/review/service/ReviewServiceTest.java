package com.reviewduck.review.service;

import static org.assertj.core.api.Assertions.*;
import static org.junit.jupiter.api.Assertions.*;

import java.util.List;

import javax.transaction.Transactional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.jdbc.Sql;

import com.reviewduck.auth.exception.AuthorizationException;
import com.reviewduck.common.exception.NotFoundException;
import com.reviewduck.member.domain.Member;
import com.reviewduck.member.service.MemberService;
import com.reviewduck.review.domain.Review;
import com.reviewduck.review.domain.ReviewForm;
import com.reviewduck.review.dto.request.AnswerRequest;
import com.reviewduck.review.dto.request.ReviewFormCreateRequest;
import com.reviewduck.review.dto.request.ReviewFormQuestionRequest;
import com.reviewduck.review.dto.request.ReviewRequest;

@SpringBootTest
@Sql("classpath:truncate.sql")
@Transactional
public class ReviewServiceTest {

    private final String invalidCode = "aaaaaaaa";
    @Autowired
    private ReviewFormService reviewFormService;
    @Autowired
    private ReviewService reviewService;
    @Autowired
    private MemberService memberService;

    private ReviewForm savedReviewForm;
    private Long questionId1;
    private Long questionId2;
    private Member member1;
    private Member member2;

    @BeforeEach
    void setUp() {
        Member tempMember1 = new Member("jason", "제이슨", "testUrl1");
        member1 = memberService.save(tempMember1);

        Member tempMember2 = new Member("woni", "워니", "testUrl2");
        member2 = memberService.save(tempMember2);

        String reviewTitle = "title";
        List<ReviewFormQuestionRequest> questions = List.of(new ReviewFormQuestionRequest("question1"),
            new ReviewFormQuestionRequest("question2"));
        ReviewFormCreateRequest createRequest = new ReviewFormCreateRequest(reviewTitle, questions);

        this.savedReviewForm = reviewFormService.save(member1, createRequest);
        this.questionId1 = savedReviewForm.getReviewFormQuestions().get(0).getId();
        this.questionId2 = savedReviewForm.getReviewFormQuestions().get(1).getId();
    }

    @Test
    @DisplayName("회고를 저장한다.")
    void saveReview() {
        // when
        ReviewRequest reviewCreateRequest = new ReviewRequest(
            List.of(new AnswerRequest(questionId1, "answer1"), new AnswerRequest(questionId2, "answer2")));
        Review savedReview = reviewService.save(member1, savedReviewForm.getCode(), reviewCreateRequest);

        // then
        assertAll(
            () -> assertThat(savedReview.getId()).isNotNull(),
            () -> assertThat(savedReview.getMember().getNickname()).isEqualTo("제이슨"),
            () -> assertThat(savedReview.getQuestionAnswers().get(0).getAnswer().getValue())
                .isEqualTo("answer1"),
            () -> assertThat(savedReview.getQuestionAnswers().get(0).getPosition())
                .isEqualTo(0)
        );
    }

    @Test
    @DisplayName("유효하지 않은 입장 코드로 회고를 저장할 수 없다.")
    void saveReviewWithInvalidCode() {
        // given
        ReviewRequest reviewCreateRequest = new ReviewRequest(
            List.of(new AnswerRequest(1L, "answer1"), new AnswerRequest(2L, "answer2")));

        // when, then
        assertThatThrownBy(() -> reviewService.save(member1, invalidCode, reviewCreateRequest))
            .isInstanceOf(NotFoundException.class)
            .hasMessageContaining("존재하지 않는 회고 폼입니다.");
    }

    @Test
    @DisplayName("유효하지 않은 질문 번호로 회고를 저장할 수 없다.")
    void saveReviewWithInvalidQuestionId() {
        //given
        ReviewRequest reviewCreateRequest = new ReviewRequest(
            List.of(new AnswerRequest(123445L, "answer1"),
                new AnswerRequest(2L, "answer2")));

        // when, then
        assertThatThrownBy(() -> reviewService.save(member1, savedReviewForm.getCode(), reviewCreateRequest))
            .isInstanceOf(NotFoundException.class)
            .hasMessageContaining("존재하지 않는 질문입니다.");
    }

    @Test
    @DisplayName("특정 회고 폼을 기반으로 작성된 회고를 모두 조회한다.")
    void findReviewsBySpecificReviewForm() {
        // given
        ReviewRequest reviewCreateRequest = new ReviewRequest(
            List.of(new AnswerRequest(questionId1, "answer1"), new AnswerRequest(questionId2, "answer2")));
        Review savedReview = reviewService.save(member1, savedReviewForm.getCode(), reviewCreateRequest);

        // when
        List<Review> reviews = reviewService.findAllByCode(savedReviewForm.getCode());

        // then
        assertAll(
            () -> assertThat(reviews).hasSize(1),
            () -> assertThat(reviews.get(0).getMember().getNickname()).isEqualTo(savedReview.getMember().getNickname())
        );
    }

    @Test
    @DisplayName("특정 회고 폼을 삭제해도 본인이 작성한 회고를 조회할 수 있다.")
    void findReviewsByDeletedSpecificReviewForm() {
        // given
        ReviewRequest reviewCreateRequest = new ReviewRequest(
            List.of(new AnswerRequest(questionId1, "answer1"), new AnswerRequest(questionId2, "answer2")));
        Review savedReview = reviewService.save(member1, savedReviewForm.getCode(), reviewCreateRequest);

        // when
        reviewFormService.deleteByCode(member1, savedReviewForm.getCode());
        List<Review> reviews = reviewService.findByMember(member1);

        // then
        assertAll(
            () -> assertThat(reviews).hasSize(1),
            () -> assertThat(reviews.get(0).getMember().getNickname()).isEqualTo(savedReview.getMember().getNickname())
        );
    }

    @Test
    @DisplayName("회고를 수정한다.")
    void editReview() {
        // given
        ReviewRequest reviewCreateRequest = new ReviewRequest(
            List.of(new AnswerRequest(questionId1, "answer1"), new AnswerRequest(questionId2, "answer2")));
        Review savedReview = reviewService.save(member1, savedReviewForm.getCode(), reviewCreateRequest);

        // when
        ReviewRequest editRequest = new ReviewRequest(
            List.of(new AnswerRequest(questionId1, "editedAnswer1"), new AnswerRequest(questionId2, "editedAnswer2")));
        Review updatedReview = reviewService.update(member1, savedReview.getId(), editRequest);

        // then
        assertAll(
            () -> assertThat(updatedReview.getId()).isNotNull(),
            () -> assertThat(updatedReview.getMember().getNickname()).isEqualTo("제이슨"),
            () -> assertThat(updatedReview.getQuestionAnswers().get(0).getAnswer().getValue())
                .isEqualTo("editedAnswer1")
        );
    }

    @Test
    @DisplayName("본인이 생성한 회고가 아니면 수정할 수 없다.")
    void updateNotMyReview() {
        // given
        ReviewRequest reviewCreateRequest = new ReviewRequest(
            List.of(new AnswerRequest(questionId1, "answer1"), new AnswerRequest(questionId2, "answer2")));
        Review savedReview = reviewService.save(member1, savedReviewForm.getCode(), reviewCreateRequest);
        ReviewRequest editRequest = new ReviewRequest(
            List.of(new AnswerRequest(questionId1, "editedAnswer1"), new AnswerRequest(questionId2, "editedAnswer2")));

        // when, then
        assertThatThrownBy(() -> reviewService.update(member2, savedReview.getId(), editRequest))
            .isInstanceOf(AuthorizationException.class)
            .hasMessageContaining("본인이 생성한 회고가 아니면 수정할 수 없습니다.");
    }

    @Test
    @DisplayName("존재하지 않는 회고는 수정할 수 없다.")
    void updateInvalidReview() {
        // given
        ReviewRequest editRequest = new ReviewRequest(
            List.of(new AnswerRequest(questionId1, "editedAnswer1"), new AnswerRequest(questionId2, "editedAnswer2")));

        // when, then
        assertThatThrownBy(() -> reviewService.update(member1, 99999L, editRequest))
            .isInstanceOf(NotFoundException.class)
            .hasMessageContaining("존재하지 않는 회고입니다.");
    }

    @Test
    @DisplayName("회고를 삭제한다.")
    void deleteReview() {
        // given
        ReviewRequest reviewCreateRequest = new ReviewRequest(
            List.of(new AnswerRequest(questionId1, "answer1"), new AnswerRequest(questionId2, "answer2")));
        Review savedReview = reviewService.save(member1, savedReviewForm.getCode(), reviewCreateRequest);

        // when
        reviewService.delete(member1, savedReview.getId());

        // then
        assertThat(reviewService.findAllByCode(savedReviewForm.getCode())).hasSize(0);
    }

    @Test
    @DisplayName("본인이 생성한 회고가 아니면 삭제할 수 없다.")
    void deleteNotMyReview() {
        // given
        ReviewRequest reviewCreateRequest = new ReviewRequest(
            List.of(new AnswerRequest(questionId1, "answer1"), new AnswerRequest(questionId2, "answer2")));
        long savedReviewId = reviewService.save(member1, savedReviewForm.getCode(), reviewCreateRequest).getId();

        // when, then
        assertThatThrownBy(() -> reviewService.delete(member2, savedReviewId))
            .isInstanceOf(AuthorizationException.class)
            .hasMessageContaining("본인이 생성한 회고가 아니면 삭제할 수 없습니다.");
    }

    @Test
    @DisplayName("존재하지 않는 회고는 삭제할 수 없다.")
    void deleteInvalidReview() {
        // when, then
        assertThatThrownBy(() -> reviewService.delete(member1, 99999L))
            .isInstanceOf(NotFoundException.class)
            .hasMessageContaining("존재하지 않는 회고입니다.");
    }

    @Test
    @DisplayName("개인이 작성한 회고 답변을 조회한다.")
    void findMyReviews() {
        // given
        ReviewRequest reviewCreateRequest = new ReviewRequest(
            List.of(new AnswerRequest(questionId1, "answer1"), new AnswerRequest(questionId2, "answer2")));
        reviewService.save(member1, savedReviewForm.getCode(), reviewCreateRequest);

        ReviewRequest reviewCreateRequest2 = new ReviewRequest(
            List.of(new AnswerRequest(questionId1, "answer3"), new AnswerRequest(questionId2, "answer4")));
        reviewService.save(member2, savedReviewForm.getCode(), reviewCreateRequest2);

        // when
        List<Review> myReviews = reviewService.findByMember(member2);

        // then
        assertAll(
            () -> assertThat(myReviews).hasSize(1),
            () -> assertThat(myReviews.get(0)).isNotNull(),
            () -> assertThat(myReviews.get(0).getMember().getNickname()).isEqualTo("워니")
        );
    }
}
