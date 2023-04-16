package com.reviewduck.review.service;

import com.reviewduck.common.service.ServiceTest;
import com.reviewduck.review.domain.ReviewForm;
import com.reviewduck.review.dto.controller.request.*;
import com.reviewduck.review.dto.controller.response.ReviewCommentsResponse;
import com.reviewduck.review.dto.service.ReviewFormQuestionCreateDto;
import com.reviewduck.review.repository.ReviewCommentRepository;
import com.reviewduck.review.repository.ReviewFormRepository;
import com.reviewduck.review.repository.ReviewRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

public class ReviewCommentServiceTest extends ServiceTest {
    private static final String invalidCode = "aaaaaaaa";

    private ReviewForm reviewForm;

    @Autowired
    private ReviewService reviewService;

    @Autowired
    private ReviewFormService reviewFormService;

    @Autowired
    private ReviewFormRepository reviewFormRepository;

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private ReviewCommentRepository reviewCommentRepository;

    @Autowired
    private ReviewCommentService reviewCommentService;

    @BeforeEach
    void createReviewForm() {
        String reviewTitle = "title";
        List<ReviewFormQuestionCreateDto> questions = List.of(
                new ReviewFormQuestionCreateDto("question1", "description1"),
                new ReviewFormQuestionCreateDto("question2", "description2"));

        ReviewForm reviewForm1 = new ReviewForm(member1, reviewTitle, questions);
        this.reviewForm = reviewFormRepository.save(reviewForm1);
    }

    @Test
    @DisplayName("회고에 댓글을 작성한다.")
    void saveReviewComment() {
        // given
        long questionId1 = reviewForm.getQuestions().get(0).getId();
        long questionId2 = reviewForm.getQuestions().get(1).getId();

        ReviewCreateRequest reviewCreateRequest = new ReviewCreateRequest(false, "title",
                List.of(
                        new ReviewContentCreateRequest(questionId1, new AnswerCreateRequest("answer1")),
                        new ReviewContentCreateRequest(questionId2, new AnswerCreateRequest("answer2"))
                ));

        long reviewId = reviewService.save(memberId1, reviewForm.getCode(), reviewCreateRequest);
        // when
        ReviewCommentCreateRequest request = new ReviewCommentCreateRequest("reviewComment");
        long reviewCommentId = reviewCommentService.save(memberId1, reviewId, request);

        // then
        assertThat(reviewCommentRepository.findById(reviewCommentId)).isNotNull();
    }

    @Test
    @DisplayName("회고에 달린 댓글을 모두 조회한다.")
    void getReviewComments() {
        // given
        long questionId1 = reviewForm.getQuestions().get(0).getId();
        long questionId2 = reviewForm.getQuestions().get(1).getId();

        ReviewCreateRequest reviewCreateRequest = new ReviewCreateRequest(false, "title",
                List.of(
                        new ReviewContentCreateRequest(questionId1, new AnswerCreateRequest("answer1")),
                        new ReviewContentCreateRequest(questionId2, new AnswerCreateRequest("answer2"))
                ));

        long reviewId = reviewService.save(memberId1, reviewForm.getCode(), reviewCreateRequest);
        // 리뷰에 댓글 2개 달기
        ReviewCommentCreateRequest request1 = new ReviewCommentCreateRequest("reviewComment1");
        ReviewCommentCreateRequest request2 = new ReviewCommentCreateRequest("reviewComment2");
        reviewCommentService.save(memberId1, reviewId, request1);
        reviewCommentService.save(memberId1, reviewId, request2);

        // when
        int page = 0;
        int size = 2;
        ReviewCommentsResponse response = reviewCommentService.findAll(reviewId, page, size);

        // then
        assertThat(response.isLastPage()).isEqualTo(true);
        assertThat(response.getNumberOfReviews()).isEqualTo(2);
        assertThat(response.getComments().get(0).getContent()).isEqualTo("reviewComment1");
        assertThat(response.getComments().get(1).getContent()).isEqualTo("reviewComment2");
    }

    @Test
    @DisplayName("회고에 달린 댓글을 수정한다.")
    void updateReviewComments() {
        // given
        long questionId1 = reviewForm.getQuestions().get(0).getId();
        long questionId2 = reviewForm.getQuestions().get(1).getId();

        ReviewCreateRequest reviewCreateRequest = new ReviewCreateRequest(false, "title",
                List.of(
                        new ReviewContentCreateRequest(questionId1, new AnswerCreateRequest("answer1")),
                        new ReviewContentCreateRequest(questionId2, new AnswerCreateRequest("answer2"))
                ));

        long reviewId = reviewService.save(memberId1, reviewForm.getCode(), reviewCreateRequest);
        ReviewCommentCreateRequest createRequest = new ReviewCommentCreateRequest("reviewComment1");
        reviewCommentService.save(memberId1, reviewId, createRequest);

        // when
        ReviewCommentUpdateRequest request = new ReviewCommentUpdateRequest("reviewUpdateComment");
        reviewCommentService.update(memberId1, reviewId, request);
        int page = 0;
        int size = 1;
        ReviewCommentsResponse response = reviewCommentService.findAll(reviewId, page, size);

        // then
        assertThat(response.getComments().get(0).getContent()).isEqualTo("reviewUpdateComment");
    }

    @Test
    @DisplayName("회고에 달린 댓글을 삭제한다.")
    void deleteReviewComments() {
        // given
        long questionId1 = reviewForm.getQuestions().get(0).getId();
        long questionId2 = reviewForm.getQuestions().get(1).getId();

        ReviewCreateRequest reviewCreateRequest = new ReviewCreateRequest(false, "title",
                List.of(
                        new ReviewContentCreateRequest(questionId1, new AnswerCreateRequest("answer1")),
                        new ReviewContentCreateRequest(questionId2, new AnswerCreateRequest("answer2"))
                ));

        long reviewId = reviewService.save(memberId1, reviewForm.getCode(), reviewCreateRequest);
        ReviewCommentCreateRequest createRequest = new ReviewCommentCreateRequest("reviewComment1");
        long commentId = reviewCommentService.save(memberId1, reviewId, createRequest);

        // when
        reviewCommentService.delete(memberId1, commentId);
        int page = 0;
        int size = 1;
        ReviewCommentsResponse response = reviewCommentService.findAll(reviewId, page, size);

        // then
        assertThat(response.getNumberOfReviews()).isEqualTo(0);
    }
}
