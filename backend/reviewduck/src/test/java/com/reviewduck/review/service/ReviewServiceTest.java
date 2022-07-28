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
    private Member member;
    private Long questionId1;
    private Long questionId2;

    @BeforeEach
    void setUp() {
        String reviewTitle = "title";
        List<ReviewFormQuestionRequest> questions = List.of(new ReviewFormQuestionRequest("question1"),
            new ReviewFormQuestionRequest("question2"));
        ReviewFormCreateRequest createRequest = new ReviewFormCreateRequest(reviewTitle, questions);

        member = new Member("panda", "제이슨", "testUrl1");
        memberService.save(member);
        this.savedReviewForm = reviewFormService.save(member, createRequest);

        this.questionId1 = savedReviewForm.getReviewFormQuestions().get(0).getId();
        this.questionId2 = savedReviewForm.getReviewFormQuestions().get(1).getId();
    }

    @Test
    @DisplayName("리뷰를 저장한다.")
    void saveReview() {
        // when
        ReviewRequest reviewCreateRequest = new ReviewRequest("제이슨",
            List.of(new AnswerRequest(questionId1, "answer1"), new AnswerRequest(questionId2, "answer2")));
        Review savedReview = reviewService.save(member, savedReviewForm.getCode(), reviewCreateRequest);

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
    @DisplayName("유효하지 않은 입장 코드로 리뷰를 저장할 수 없다.")
    void saveReviewWithInvalidCode() {
        // given
        ReviewRequest reviewCreateRequest = new ReviewRequest("제이슨",
            List.of(new AnswerRequest(1L, "answer1"), new AnswerRequest(2L, "answer2")));

        // when, then
        assertThatThrownBy(() -> reviewService.save(member, invalidCode, reviewCreateRequest))
            .isInstanceOf(NotFoundException.class)
            .hasMessageContaining("존재하지 않는 회고 폼입니다.");
    }

    @Test
    @DisplayName("유효하지 않은 질문 번호로 회고를 작성할 수 없다.")
    void saveReviewWithInvalidQuestionId() {
        //given
        ReviewRequest reviewCreateRequest = new ReviewRequest("제이슨",
            List.of(new AnswerRequest(123445L, "answer1"),
                new AnswerRequest(2L, "answer2")));

        // when, then
        assertThatThrownBy(() -> reviewService.save(member, savedReviewForm.getCode(), reviewCreateRequest))
            .isInstanceOf(NotFoundException.class)
            .hasMessageContaining("존재하지 않는 질문입니다.");
    }

    @Test
    @DisplayName("특정 회고 폼을 기반으로 작성된 회고를 모두 조회한다.")
    void findReviewsBySpecificReviewForm() {
        // given
        ReviewRequest reviewCreateRequest = new ReviewRequest("제이슨",
            List.of(new AnswerRequest(questionId1, "answer1"), new AnswerRequest(questionId2, "answer2")));
        Review savedReview = reviewService.save(member, savedReviewForm.getCode(), reviewCreateRequest);

        // when
        List<Review> reviews = reviewService.findAllByCode(savedReviewForm.getCode());

        // then
        assertAll(
            () -> assertThat(reviews).hasSize(1),
            () -> assertThat(reviews.get(0).getMember().getNickname()).isEqualTo(savedReview.getMember().getNickname())
        );
    }

    @Test
    @DisplayName("리뷰를 수정한다.")
    void editReview() {
        // given
        ReviewRequest reviewCreateRequest = new ReviewRequest("제이슨",
            List.of(new AnswerRequest(questionId1, "answer1"), new AnswerRequest(questionId2, "answer2")));
        Review savedReview = reviewService.save(member, savedReviewForm.getCode(), reviewCreateRequest);

        // when
        ReviewRequest editRequest = new ReviewRequest("제이슨",
            List.of(new AnswerRequest(questionId1, "editedAnswer1"), new AnswerRequest(questionId2, "editedAnswer2")));
        Review updatedReview = reviewService.update(member, savedReview.getId(), editRequest);

        // then
        assertAll(
            () -> assertThat(updatedReview.getId()).isNotNull(),
            () -> assertThat(updatedReview.getMember().getNickname()).isEqualTo("제이슨"),
            () -> assertThat(updatedReview.getQuestionAnswers().get(0).getAnswer().getValue())
                .isEqualTo("editedAnswer1")
        );
    }

    @Test
    @DisplayName("리뷰를 삭제한다.")
    void deleteReview() {
        // given
        ReviewRequest reviewCreateRequest = new ReviewRequest("제이슨",
            List.of(new AnswerRequest(questionId1, "answer1"), new AnswerRequest(questionId2, "answer2")));
        Review savedReview = reviewService.save(member, savedReviewForm.getCode(), reviewCreateRequest);

        // when
        reviewService.delete(member, savedReview.getId());

        // then
        assertThat(reviewService.findAllByCode(savedReviewForm.getCode())).hasSize(0);
    }

    @Test
    @DisplayName("개인이 작성한 회고 답변을 조회한다.")
    void findMyReviews() {
        // given
        ReviewRequest reviewCreateRequest = new ReviewRequest("제이슨",
            List.of(new AnswerRequest(questionId1, "answer1"), new AnswerRequest(questionId2, "answer2")));
        reviewService.save(member, savedReviewForm.getCode(), reviewCreateRequest);

        Member member2 = new Member("ariari", "브리", "testUrl2");
        memberService.save(member2);

        ReviewRequest reviewCreateRequest2 = new ReviewRequest("브리",
            List.of(new AnswerRequest(questionId1, "answer3"), new AnswerRequest(questionId2, "answer4")));
        reviewService.save(member2, savedReviewForm.getCode(), reviewCreateRequest2);

        // when
        List<Review> myReviews = reviewService.findByMember(member2);

        // then
        assertAll(
            () -> assertThat(myReviews).hasSize(1),
            () -> assertThat(myReviews.get(0)).isNotNull(),
            () -> assertThat(myReviews.get(0).getMember().getNickname()).isEqualTo("브리")
        );
    }
}
