package com.reviewduck.review.service;

import static org.assertj.core.api.Assertions.*;
import static org.junit.jupiter.api.Assertions.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.reviewduck.auth.exception.AuthorizationException;
import com.reviewduck.common.exception.NotFoundException;
import com.reviewduck.common.service.ServiceTest;
import com.reviewduck.member.domain.Member;
import com.reviewduck.review.domain.Answer;
import com.reviewduck.review.domain.Review;
import com.reviewduck.review.domain.ReviewForm;
import com.reviewduck.review.dto.controller.request.AnswerCreateRequest;
import com.reviewduck.review.dto.controller.request.AnswerUpdateRequest;
import com.reviewduck.review.dto.controller.request.ReviewContentCreateRequest;
import com.reviewduck.review.dto.controller.request.ReviewContentUpdateRequest;
import com.reviewduck.review.dto.controller.request.ReviewCreateRequest;
import com.reviewduck.review.dto.controller.request.ReviewUpdateRequest;
import com.reviewduck.review.dto.controller.response.ReviewLikesResponse;
import com.reviewduck.review.dto.controller.response.ReviewResponse;
import com.reviewduck.review.dto.controller.response.ReviewSynchronizedResponse;
import com.reviewduck.review.dto.controller.response.ReviewsOfReviewFormResponse;
import com.reviewduck.review.dto.controller.response.ReviewsResponse;
import com.reviewduck.review.dto.controller.response.TimelineReviewsResponse;
import com.reviewduck.review.dto.service.QuestionAnswerCreateDto;
import com.reviewduck.review.dto.service.ReviewFormQuestionCreateDto;

public class ReviewServiceTest extends ServiceTest {

    private static final String invalidCode = "aaaaaaaa";

    private ReviewForm reviewForm1;
    private ReviewForm reviewForm2;

    @BeforeEach
    void createReviewForm() {
        String reviewTitle = "title";
        List<ReviewFormQuestionCreateDto> questions = List.of(
            new ReviewFormQuestionCreateDto("question1", "description1"),
            new ReviewFormQuestionCreateDto("question2", "description2"));

        ReviewForm reviewForm1 = new ReviewForm(member1, reviewTitle, questions);
        ReviewForm reviewForm2 = new ReviewForm(member1, reviewTitle, questions);
        this.reviewForm1 = reviewFormRepository.save(reviewForm1);
        this.reviewForm2 = reviewFormRepository.save(reviewForm2);
    }

    @Nested
    @DisplayName("회고 저장")
    class saveReview {

        @Test
        @DisplayName("회고를 저장한다.")
        void saveReview() {
            // given
            long questionId1 = reviewForm1.getQuestions().get(0).getId();
            long questionId2 = reviewForm1.getQuestions().get(1).getId();

            ReviewCreateRequest reviewCreateRequest = new ReviewCreateRequest(false, "title",
                List.of(
                    new ReviewContentCreateRequest(questionId1, new AnswerCreateRequest("answer1")),
                    new ReviewContentCreateRequest(questionId2, new AnswerCreateRequest("answer2"))
                ));

            // when
            long reviewId = reviewService.save(memberId1, reviewForm1.getCode(), reviewCreateRequest);
            Review savedReview = findById(reviewId);

            // then
            assertThat(savedReview.getId()).isNotNull();
        }

        @Test
        @DisplayName("유효하지 않은 입장 코드로 저장할 수 없다.")
        void withInvalidCode() {
            // given
            ReviewCreateRequest reviewCreateRequest = new ReviewCreateRequest(false, "title",
                List.of(
                    new ReviewContentCreateRequest(1L, new AnswerCreateRequest("answer1")),
                    new ReviewContentCreateRequest(2L, new AnswerCreateRequest("answer2"))
                ));

            // when, then
            assertThatThrownBy(() -> reviewService.save(memberId1, invalidCode, reviewCreateRequest))
                .isInstanceOf(NotFoundException.class)
                .hasMessageContaining("존재하지 않는 회고 폼입니다.");
        }

        @Test
        @DisplayName("유효하지 않은 질문 번호로 저장할 수 없다.")
        void withInvalidQuestionId() {
            //given
            ReviewCreateRequest reviewCreateRequest = new ReviewCreateRequest(false, "title",
                List.of(
                    new ReviewContentCreateRequest(9999L, new AnswerCreateRequest("answer1")),
                    new ReviewContentCreateRequest(2L, new AnswerCreateRequest("answer2"))
                ));

            // when, then
            assertThatThrownBy(() -> reviewService.save(memberId1, reviewForm1.getCode(), reviewCreateRequest))
                .isInstanceOf(NotFoundException.class)
                .hasMessageContaining("존재하지 않는 질문입니다.");
        }

    }

    @Nested
    @DisplayName("id로 회고 조회")
    class findById {

        @Test
        @DisplayName("id로 특정 회고를 조회한다.")
        void findById() throws InterruptedException {
            // given
            Review saved = saveReview(reviewForm1, member1, false);

            // when
            ReviewSynchronizedResponse reviewEditResponse = (ReviewSynchronizedResponse)reviewService.findById(saved.getId());

            // then
            assertThat(saved.getTitle()).isEqualTo(reviewEditResponse.getReviewTitle());
        }

        @Test
        @DisplayName("존재하지 않는 id로 조회할 수 없다.")
        void invalidId() {
            // when, then
            assertThatThrownBy(() -> reviewService.findById(99999L))
                .isInstanceOf(NotFoundException.class)
                .hasMessageContaining("존재하지 않는 회고입니다.");
        }

    }

    @Nested
    @DisplayName("사용자가 생성한 회고 조회")
    class findMemberReview {

        @Test
        @DisplayName("자신이 작성한 회고 중 최신순으로 첫 페이지를 조회한다.")
        void findPageOfMyReviewsOrderByLatest() throws InterruptedException {
            // given
            saveReview(reviewForm1, member2, false);
            saveReview(reviewForm1, member1, true);
            Review review = saveReview(reviewForm1, member1, false);

            // when
            int page = 0;
            int size = 3;
            ReviewsResponse reviewsResponse = reviewService.findAllBySocialId(member1.getSocialId(), memberId1, page,
                size);

            // then
            assertAll(
                () -> assertThat(reviewsResponse.getReviews()).hasSize(2),
                () -> assertThat(reviewsResponse.getReviews().get(0).getId()).isEqualTo(review.getId()),
                () -> assertThat(reviewsResponse.getIsMine()).isTrue()
            );
        }

        @Test
        @DisplayName("타인이 작성한 회고 중 최신순으로 첫 페이지를 조회한다.")
        void findPageOfOtherReviewsOrderByUpdatedAtDesc() throws InterruptedException {
            // given
            saveReview(reviewForm1, member1, false);
            saveReview(reviewForm1, member1, true);
            Review review = saveReview(reviewForm1, member1, false);

            // when
            int page = 0;
            int size = 3;
            ReviewsResponse reviewsResponse = reviewService.findAllBySocialId(member1.getSocialId(), memberId2, page,
                size);

            // then
            assertAll(
                () -> assertThat(reviewsResponse.getReviews()).hasSize(2),
                () -> assertThat(reviewsResponse.getReviews().get(0).getId()).isEqualTo(review.getId()),
                () -> assertThat(reviewsResponse.getIsMine()).isFalse()
            );
        }

        @Test
        @DisplayName("특정 회고 폼을 삭제해도 자신이 생성한 회고를 조회할 수 있다.")
        void findPageOfReviewsByDeletedSpecificReviewForm() throws InterruptedException {
            // given
            Review savedReview = saveReview(reviewForm1, member1, false);

            // when
            reviewFormService.deleteByCode(memberId1, reviewForm1.getCode());
            int page = 0;
            int size = 3;
            ReviewsResponse reviewsResponse = reviewService.findAllBySocialId(member1.getSocialId(), memberId2, page,
                size);

            // then
            assertAll(
                () -> assertThat(reviewsResponse.getReviews()).hasSize(1),
                () -> assertThat(reviewsResponse.getReviews().get(0).getId()).isEqualTo(savedReview.getId())
            );
        }

    }

    @Nested
    @DisplayName("회고 폼 code로 회고 조회")
    class findByCode {

        @Test
        @DisplayName("최신순으로 특정 페이지를 조회한다.")
        void findAllOrderByTrend() throws InterruptedException {
            // given
            saveReview(reviewForm1, member1, false);
            Review review = saveReview(reviewForm1, member2, true);
            saveReview(reviewForm1, member1, true);

            // when
            int page = 1;
            int size = 1;

            ReviewsOfReviewFormResponse result = reviewService.findAllByCode(reviewForm1.getCode(), page, size,
                "list", member1.getId());

            List<ReviewResponse> reviewResponses = result.getReviews().stream()
                .map(it -> (ReviewResponse)it)
                .collect(Collectors.toUnmodifiableList());

            // then
            assertAll(
                () -> assertThat(reviewResponses).hasSize(1),
                () -> assertThat(reviewResponses.get(0).getId()).isEqualTo(review.getId()),
                () -> assertThat(reviewResponses.get(0).getReviewTitle()).isEqualTo(review.getTitle())
            );
        }

        @Test
        @DisplayName("존재하지 않는 회고 폼으로 조회할 수 없다.")
        void invalidCode() {
            // when, then
            assertThatThrownBy(() -> reviewService.findAllByCode(invalidCode, 0, 1, "list", memberId1))
                .isInstanceOf(NotFoundException.class)
                .hasMessageContaining("존재하지 않는 회고 폼입니다.");
        }
    }

    @Nested
    @DisplayName("비밀글이 아닌 회고 답변을 모두 조회한다.")
    class findTimelineReview {

        @Test
        @DisplayName("최신순으로 특정 페이지를 조회한다.")
        void findAllOrderByLatest() throws InterruptedException {
            // given
            saveReview(reviewForm1, member1, false);
            Review review = saveReview(reviewForm1, member2, false);
            saveReview(reviewForm1, member1, true);

            // when
            int page = 0;
            int size = 1;
            String sort = "latest";

            TimelineReviewsResponse reviewsResponse = reviewService.findAllPublic(page, size, sort, memberId1);

            // then
            assertAll(
                () -> assertThat(reviewsResponse.getReviews()).hasSize(1),
                () -> assertThat(reviewsResponse.getReviews().get(0).getId()).isEqualTo(review.getId()),
                () -> assertThat(reviewsResponse.getReviews().get(0).getReviewTitle()).isEqualTo(review.getTitle())
            );
        }

        @Test
        @DisplayName("좋아요가 특정 개수 이상이며 생성일로 정렬된 특정 페이지를 조회한다.")
        void findAllOrderByTrend() throws InterruptedException {
            // given
            Review review1 = saveReview(reviewForm1, member1, false);
            Review review2 = saveReview(reviewForm1, member2, false);
            Review review3 = saveReview(reviewForm1, member1, true); // 비밀글
            Review review4 = saveReview(reviewForm1, member1, false);

            // when
            reviewService.increaseLikes(review1.getId(), 500);
            reviewService.increaseLikes(review2.getId(), 300);
            reviewService.increaseLikes(review4.getId(), 10); // 좋아요 개수 미만

            int page = 0;
            int size = 1;
            String sort = "trend";

            TimelineReviewsResponse reviewsResponse = reviewService.findAllPublic(page, size, sort, memberId1);

            // then
            assertAll(
                () -> assertThat(reviewsResponse.getReviews()).hasSize(1),
                () -> assertThat(reviewsResponse.getReviews().get(0).getId()).isEqualTo(review2.getId()),
                () -> assertThat(reviewsResponse.getReviews().get(0).getLikes()).isEqualTo(300)
            );
        }
    }

    @Nested
    @DisplayName("회고 수정")
    class updateReview {

        @Test
        @DisplayName("회고를 수정한다.")
        void updateReview() throws InterruptedException {
            // given
            Review savedReview = saveReview(reviewForm1, member1, true);

            // when
            ReviewUpdateRequest updateRequest = new ReviewUpdateRequest(false, "title",
                List.of(
                    new ReviewContentUpdateRequest(1L, new AnswerUpdateRequest("editedAnswer1")),
                    new ReviewContentUpdateRequest(2L, new AnswerUpdateRequest("editedAnswer2"))
                ));

            reviewService.update(memberId1, savedReview.getId(), updateRequest);

            ReviewSynchronizedResponse result = (ReviewSynchronizedResponse)reviewService.findById(savedReview.getId());


            // then
            assertAll(
                () -> assertThat(result.getReviewTitle()).isEqualTo(updateRequest.getTitle()),
                () -> assertThat(result.getContents().get(0).getAnswer().getValue())
                    .isEqualTo("editedAnswer1"),
                () -> assertThat(result.getIsPrivate()).isFalse()
            );
        }

        @Test
        @DisplayName("본인이 생성한 회고가 아니면 수정할 수 없다.")
        void notMine() throws InterruptedException {
            // given
            Review savedReview = saveReview(reviewForm1, member1, false);

            // when
            ReviewUpdateRequest updateRequest = new ReviewUpdateRequest(false, "title",
                List.of(
                    new ReviewContentUpdateRequest(1L, new AnswerUpdateRequest("editedAnswer1")),
                    new ReviewContentUpdateRequest(2L, new AnswerUpdateRequest("editedAnswer2"))
                ));

            // then
            assertThatThrownBy(() -> reviewService.update(memberId2, savedReview.getId(), updateRequest))
                .isInstanceOf(AuthorizationException.class)
                .hasMessageContaining("본인이 생성한 회고가 아니면 수정할 수 없습니다.");
        }

        @Test
        @DisplayName("존재하지 않는 회고는 수정할 수 없다.")
        void invalidId() {
            // given
            ReviewUpdateRequest updateRequest = new ReviewUpdateRequest(false, "title",
                List.of(
                    new ReviewContentUpdateRequest(1L, new AnswerUpdateRequest("editedAnswer1")),
                    new ReviewContentUpdateRequest(2L, new AnswerUpdateRequest("editedAnswer2"))
                ));

            // when, then
            assertThatThrownBy(() -> reviewService.update(memberId1, 99999L, updateRequest))
                .isInstanceOf(NotFoundException.class)
                .hasMessageContaining("존재하지 않는 회고입니다.");
        }

        @Test
        @DisplayName("유효하지 않은 질문 번호로 수정할 수 없다.")
        void withInvalidQuestionId() throws InterruptedException {
            // given
            Review savedReview = saveReview(reviewForm1, member1, false);

            ReviewUpdateRequest updateRequest = new ReviewUpdateRequest(false, "title",
                List.of(
                    new ReviewContentUpdateRequest(1L, new AnswerUpdateRequest("editedAnswer1")),
                    new ReviewContentUpdateRequest(999L, new AnswerUpdateRequest("editedAnswer2"))
                ));

            // when, then
            assertThatThrownBy(() -> reviewService.update(memberId1, savedReview.getId(), updateRequest))
                .isInstanceOf(NotFoundException.class)
                .hasMessageContaining("존재하지 않는 질문입니다.");
        }
    }

    @Nested
    @DisplayName("회고 삭제")
    class deleteReview {

        @Test
        @DisplayName("회고를 삭제한다.")
        void deleteReview() throws InterruptedException {
            // given
            Review savedReview = saveReview(reviewForm1, member1, false);

            // when
            reviewService.delete(memberId1, savedReview.getId());

            // then
            assertThat(reviewService.findAllByCode(reviewForm1.getCode(), 0, 1, "list", memberId1)
                .getReviews()).hasSize(0);
        }

        @Test
        @DisplayName("본인이 생성한 회고가 아니면 삭제할 수 없다.")
        void notMine() throws InterruptedException {
            // given
            Review savedReview = saveReview(reviewForm1, member1, false);

            // when, then
            assertThatThrownBy(() -> reviewService.delete(memberId2, savedReview.getId()))
                .isInstanceOf(AuthorizationException.class)
                .hasMessageContaining("본인이 생성한 회고가 아니면 삭제할 수 없습니다.");
        }

        @Test
        @DisplayName("존재하지 않는 회고는 삭제할 수 없다.")
        void invalidId() {
            // when, then
            assertThatThrownBy(() -> reviewService.delete(memberId1, 99999L))
                .isInstanceOf(NotFoundException.class)
                .hasMessageContaining("존재하지 않는 회고입니다.");
        }

    }

    @Nested
    @DisplayName("좋아요")
    class likes {

        @Test
        @DisplayName("좋아요 수를 입력받아 더한다.")
        @Transactional(propagation = Propagation.NOT_SUPPORTED)
        void increase() throws InterruptedException {
            // given
            Review savedReview = saveReview(reviewForm1, member1, false);
            long id = savedReview.getId();

            // when
            int likeCount = 50;
            // 두 번 증가시킨다
            reviewService.increaseLikes(id, likeCount);
            ReviewLikesResponse likes = reviewService.increaseLikes(id, likeCount);

            Review review = findById(id);
            int actual = review.getLikes();

            // then
            assertAll(
                () -> assertThat(actual).isEqualTo(100),
                () -> assertThat(actual).isEqualTo(likes.getLikes())
            );
        }

        @Test
        @DisplayName("존재하지 않는 id의 좋아요를 더할 수 없다.")
        @Transactional(propagation = Propagation.NOT_SUPPORTED)
        void withInvalidIdIncrease() {
            // given
            long invalidId = 9999L;
            int likeCount = 50;

            // when, then
            assertThatThrownBy(() -> reviewService.increaseLikes(invalidId, likeCount))
                .isInstanceOf(NotFoundException.class)
                .hasMessageContaining("존재하지 않는 회고입니다.");
        }

        @Test
        @Transactional(propagation = Propagation.NOT_SUPPORTED)
        @DisplayName("좋아요를 더해도 수정 시간을 갱신하지 않는다.")
        void withNotUpdatedAt() throws InterruptedException {
            // given
            Review savedReview = saveReview(reviewForm1, member1, false);
            long id = savedReview.getId();

            // 초기 수정 시간
            // DB에 들어가서 뒷 자리수가 반올림 된 결과로 비교해야 하기 때문에 조회한다.
            LocalDateTime updatedAt = findById(id).getUpdatedAt();
            // when
            reviewService.increaseLikes(id, 50);

            // 좋아요 더한 후 수정 시간
            LocalDateTime updatedAtAfterIncreaseLikes = findById(id).getUpdatedAt();
            // then
            assertThat(updatedAtAfterIncreaseLikes.isEqual(updatedAt)).isTrue();
        }
    }

    private Review saveReview(ReviewForm reviewForm, Member member, boolean isPrivate) throws InterruptedException {
        Thread.sleep(1);

        List<QuestionAnswerCreateDto> questionAnswers = reviewForm.getQuestions().stream()
            .map(it -> new QuestionAnswerCreateDto(it, new Answer("answer")))
            .collect(Collectors.toUnmodifiableList());

        Review review = new Review("title", member, reviewForm, questionAnswers, isPrivate);

        return reviewRepository.save(review);
    }

    private Review findById(long id) {
        return reviewRepository.findById(id)
            .orElseThrow(() -> new NotFoundException("존재하지 않는 회고입니다."));
    }
}
