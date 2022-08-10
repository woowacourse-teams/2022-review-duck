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
import com.reviewduck.review.dto.request.AnswerUpdateRequest;
import com.reviewduck.review.dto.request.ReviewFormCreateRequest;
import com.reviewduck.review.dto.request.ReviewFormQuestionCreateRequest;
import com.reviewduck.review.dto.request.ReviewRequest;
import com.reviewduck.review.dto.request.ReviewUpdateRequest;

@SpringBootTest
@Sql("classpath:truncate.sql")
@Transactional
public class ReviewServiceTest {

    private static final String invalidCode = "aaaaaaaa";

    @Autowired
    private ReviewFormService reviewFormService;
    @Autowired
    private ReviewService reviewService;
    @Autowired
    private MemberService memberService;

    private ReviewForm reviewForm;
    private Member member1;
    private Member member2;

    @BeforeEach
    void setUp() {
        Member tempMember1 = new Member("1", "jason", "제이슨", "testUrl1");
        member1 = memberService.save(tempMember1);

        Member tempMember2 = new Member("2", "woni", "워니", "testUrl2");
        member2 = memberService.save(tempMember2);

        String reviewTitle = "title";
        List<ReviewFormQuestionCreateRequest> questions = List.of(
            new ReviewFormQuestionCreateRequest("question1"),
            new ReviewFormQuestionCreateRequest("question2"));
        ReviewFormCreateRequest createRequest = new ReviewFormCreateRequest(reviewTitle, questions);

        this.reviewForm = reviewFormService.save(member1, createRequest);
    }

    @Test
    @DisplayName("회고를 저장한다.")
    void createReview() {
        // given
        long questionId1 = reviewForm.getReviewFormQuestions().get(0).getId();
        long questionId2 = reviewForm.getReviewFormQuestions().get(1).getId();
        ReviewRequest reviewCreateRequest = new ReviewRequest(
            List.of(new AnswerRequest(questionId1, "answer1"), new AnswerRequest(questionId2, "answer2")));

        // when
        Review savedReview = reviewService.save(member1, reviewForm.getCode(), reviewCreateRequest);

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
        assertThatThrownBy(() -> reviewService.save(member1, reviewForm.getCode(), reviewCreateRequest))
            .isInstanceOf(NotFoundException.class)
            .hasMessageContaining("존재하지 않는 질문입니다.");
    }

    @Test
    @DisplayName("특정 회고를 조회한다.")
    void findById() {
        // given
        Review saved = saveReview(member1);

        // when
        Review actual = reviewService.findById(saved.getId());

        // then
        assertThat(actual).isEqualTo(saved);
    }

    @Test
    @DisplayName("존재하지 않는 회고는 조회할 수 없다.")
    void findInvalidReview() {
        // when, then
        assertThatThrownBy(() -> reviewService.findById(99999L))
            .isInstanceOf(NotFoundException.class)
            .hasMessageContaining("존재하지 않는 회고입니다.");
    }

    @Test
    @DisplayName("특정 회고 폼을 기반으로 작성된 회고를 모두 조회한다.")
    void findReviewsBySpecificReviewForm() {
        // given
        Review savedReview = saveReview(member1);

        // when
        List<Review> reviews = reviewService.findAllByCode(reviewForm.getCode());

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
        Review savedReview = saveReview(member1);

        // when
        reviewFormService.deleteByCode(member1, reviewForm.getCode());
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
        Review savedReview = saveReview(member1);

        // when
        ReviewUpdateRequest editRequest = new ReviewUpdateRequest(
            List.of(new AnswerUpdateRequest(1L, 1L, "editedAnswer1"),
                new AnswerUpdateRequest(2L, 2L, "editedAnswer2")));
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
        Review savedReview = saveReview(member1);

        // when
        ReviewUpdateRequest editRequest = new ReviewUpdateRequest(
            List.of(new AnswerUpdateRequest(1L, 1L, "editedAnswer1"),
                new AnswerUpdateRequest(2L, 2L, "editedAnswer2")));

        // then
        assertThatThrownBy(() -> reviewService.update(member2, savedReview.getId(), editRequest))
            .isInstanceOf(AuthorizationException.class)
            .hasMessageContaining("본인이 생성한 회고가 아니면 수정할 수 없습니다.");
    }

    @Test
    @DisplayName("존재하지 않는 회고는 수정할 수 없다.")
    void updateInvalidReview() {
        // given
        ReviewUpdateRequest editRequest = new ReviewUpdateRequest(
            List.of(new AnswerUpdateRequest(1L, 1L, "editedAnswer1"),
                new AnswerUpdateRequest(2L, 2L, "editedAnswer2")));

        // when, then
        assertThatThrownBy(() -> reviewService.update(member1, 99999L, editRequest))
            .isInstanceOf(NotFoundException.class)
            .hasMessageContaining("존재하지 않는 회고입니다.");
    }

    @Test
    @DisplayName("회고를 삭제한다.")
    void deleteReview() {
        // given
        Review savedReview = saveReview(member1);

        // when
        reviewService.delete(member1, savedReview.getId());

        // then
        assertThat(reviewService.findAllByCode(reviewForm.getCode())).hasSize(0);
    }

    @Test
    @DisplayName("본인이 생성한 회고가 아니면 삭제할 수 없다.")
    void deleteNotMyReview() {
        // given
        Review savedReview = saveReview(member1);

        // when, then
        assertThatThrownBy(() -> reviewService.delete(member2, savedReview.getId()))
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
        saveReview(member1);
        saveReview(member2);

        // when
        List<Review> myReviews = reviewService.findByMember(member2);

        // then
        assertAll(
            () -> assertThat(myReviews).hasSize(1),
            () -> assertThat(myReviews.get(0)).isNotNull(),
            () -> assertThat(myReviews.get(0).getMember().getNickname()).isEqualTo("워니")
        );
    }

    private Review saveReview(Member member) {
        ReviewRequest reviewCreateRequest = new ReviewRequest(
            List.of(new AnswerRequest(reviewForm.getReviewFormQuestions().get(0).getId(), "answer1")
                , new AnswerRequest(reviewForm.getReviewFormQuestions().get(1).getId(), "answer2")));

        return reviewService.save(member, reviewForm.getCode(), reviewCreateRequest);
    }
}
