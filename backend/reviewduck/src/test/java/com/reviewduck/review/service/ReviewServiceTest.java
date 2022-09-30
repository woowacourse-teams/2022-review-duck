package com.reviewduck.review.service;

import static org.assertj.core.api.Assertions.*;
import static org.junit.jupiter.api.Assertions.*;

import java.time.LocalDateTime;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.reviewduck.auth.exception.AuthorizationException;
import com.reviewduck.common.exception.NotFoundException;
import com.reviewduck.member.domain.Member;
import com.reviewduck.member.service.MemberService;
import com.reviewduck.review.domain.Review;
import com.reviewduck.review.domain.ReviewForm;
import com.reviewduck.review.dto.request.AnswerCreateRequest;
import com.reviewduck.review.dto.request.AnswerUpdateRequest;
import com.reviewduck.review.dto.request.ReviewContentCreateRequest;
import com.reviewduck.review.dto.request.ReviewContentUpdateRequest;
import com.reviewduck.review.dto.request.ReviewCreateRequest;
import com.reviewduck.review.dto.request.ReviewFormCreateRequest;
import com.reviewduck.review.dto.request.ReviewFormQuestionCreateRequest;
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

    private ReviewForm reviewForm1;
    private ReviewForm reviewForm2;
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
            new ReviewFormQuestionCreateRequest("question1", "description1"),
            new ReviewFormQuestionCreateRequest("question2", "description2"));
        ReviewFormCreateRequest createRequest = new ReviewFormCreateRequest(reviewTitle, questions);

        this.reviewForm1 = reviewFormService.save(member1, createRequest);
        this.reviewForm2 = reviewFormService.save(member2, createRequest);
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

            ReviewCreateRequest reviewCreateRequest = new ReviewCreateRequest(false, List.of(
                new ReviewContentCreateRequest(questionId1, new AnswerCreateRequest("answer1")),
                new ReviewContentCreateRequest(questionId2, new AnswerCreateRequest("answer2"))
            ));

            // when
            Review savedReview = reviewService.save(member1, reviewForm1.getCode(), reviewCreateRequest);

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
        @DisplayName("유효하지 않은 입장 코드로 저장할 수 없다.")
        void withInvalidCode() {
            // given
            ReviewCreateRequest reviewCreateRequest = new ReviewCreateRequest(false, List.of(
                new ReviewContentCreateRequest(1L, new AnswerCreateRequest("answer1")),
                new ReviewContentCreateRequest(2L, new AnswerCreateRequest("answer2"))
            ));

            // when, then
            assertThatThrownBy(() -> reviewService.save(member1, invalidCode, reviewCreateRequest))
                .isInstanceOf(NotFoundException.class)
                .hasMessageContaining("존재하지 않는 회고 폼입니다.");
        }

        @Test
        @DisplayName("유효하지 않은 질문 번호로 저장할 수 없다.")
        void withInvalidQuestionId() {
            //given
            ReviewCreateRequest reviewCreateRequest = new ReviewCreateRequest(false, List.of(
                new ReviewContentCreateRequest(9999L, new AnswerCreateRequest("answer1")),
                new ReviewContentCreateRequest(2L, new AnswerCreateRequest("answer2"))
            ));

            // when, then
            assertThatThrownBy(() -> reviewService.save(member1, reviewForm1.getCode(), reviewCreateRequest))
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
            Review actual = reviewService.findById(saved.getId());

            // then
            assertThat(actual).isEqualTo(saved);
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
            saveReview(reviewForm1, member1, false);
            saveReview(reviewForm1, member1, true);
            Review review = saveReview(reviewForm1, member1, false);

            // when
            int page = 0;
            int size = 3;
            List<Review> myReviews = reviewService.findBySocialId(member1.getSocialId(), member1, page, size)
                .getContent();

            // then
            assertAll(
                () -> assertThat(myReviews).hasSize(3),
                () -> assertThat(myReviews.get(0)).isNotNull(),
                () -> assertThat(myReviews.get(0).getMember().getNickname()).isEqualTo(member1.getNickname()),
                () -> assertThat(myReviews.get(0).getUpdatedAt()).isEqualTo(review.getUpdatedAt())
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
            List<Review> myReviews = reviewService.findBySocialId(member1.getSocialId(), member2, page, size)
                .getContent();

            // then
            assertAll(
                () -> assertThat(myReviews).hasSize(2),
                () -> assertThat(myReviews.get(0)).isNotNull(),
                () -> assertThat(myReviews.get(0).getMember().getNickname()).isEqualTo(member1.getNickname()),
                () -> assertThat(myReviews.get(0).getUpdatedAt()).isEqualTo(review.getUpdatedAt())
            );
        }

        @Test
        @DisplayName("특정 회고 폼을 삭제해도 자신이 생성한 회고를 조회할 수 있다.")
        void findPageOfReviewsByDeletedSpecificReviewForm() throws InterruptedException {
            // given
            Review savedReview = saveReview(reviewForm1, member1, false);

            // when
            reviewFormService.deleteByCode(member1, reviewForm1.getCode());
            int page = 0;
            int size = 3;
            List<Review> reviews = reviewService.findBySocialId(member1.getSocialId(), member1, page, size)
                .getContent();

            // then
            assertAll(
                () -> assertThat(reviews).hasSize(1),
                () -> assertThat(reviews.get(0).getMember().getNickname()).isEqualTo(
                    savedReview.getMember().getNickname())
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

            List<Review> reviews = reviewService.findAllByCode(reviewForm1.getCode(), page, size).getContent();

            // then
            assertAll(
                () -> assertThat(reviews).hasSize(1),
                () -> assertThat(reviews.get(0)).isEqualTo(review)
            );
        }

        @Test
        @DisplayName("존재하지 않는 회고 폼으로 조회할 수 없다.")
        void invalidCode() {
            // when, then
            assertThatThrownBy(() -> reviewService.findAllByCode("aaaaaa", 0, 1))
                .isInstanceOf(NotFoundException.class)
                .hasMessageContaining("존재하지 않는 회고 폼입니다.");
        }

        @Test
        @DisplayName("회고 폼 참여자 정보를 조회한다.")
        void findAllParticipants() throws InterruptedException {
            // given
            saveReview(reviewForm1, member1, false);
            saveReview(reviewForm1, member1, true);
            saveReview(reviewForm1, member1, true);

            saveReview(reviewForm2, member1, false);
            saveReview(reviewForm2, member2, true);

            // when
            List<Member> participants = reviewService.findAllParticipantsByCode(reviewForm1.getCode());

            // then
            assertAll(
                () -> assertThat(participants).hasSize(1),
                () -> assertTrue(participants.contains(member1))
            );
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

            List<Review> reviews = reviewService.findAllPublic(page, size, sort).getContent();

            // then
            assertAll(
                () -> assertThat(reviews).hasSize(1),
                () -> assertThat(reviews.get(0)).isEqualTo(review)
            );
        }

        @Test
        @DisplayName("좋아요 수 순으로 특정 페이지를 조회한다.")
        void findAllOrderByTrend() throws InterruptedException {
            // given
            Review review1 = saveReview(reviewForm1, member1, false);
            Review review2 = saveReview(reviewForm1, member2, false);
            saveReview(reviewForm1, member1, true);

            // when
            reviewService.increaseLikes(review1.getId(), 5);
            reviewService.increaseLikes(review2.getId(), 3);

            int page = 0;
            int size = 1;
            String sort = "trend";

            List<Review> reviews = reviewService.findAllPublic(page, size, sort).getContent();

            // then
            assertAll(
                () -> assertThat(reviews).hasSize(1),
                () -> assertThat(reviews.get(0).getId()).isEqualTo(review1.getId()),
                () -> assertThat(reviews.get(0).getLikes()).isEqualTo(5)
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
            ReviewUpdateRequest updateRequest = new ReviewUpdateRequest(false, List.of(
                new ReviewContentUpdateRequest(1L, new AnswerUpdateRequest(1L, "editedAnswer1")),
                new ReviewContentUpdateRequest(2L, new AnswerUpdateRequest(2L, "editedAnswer2"))
            ));

            Review updatedReview = reviewService.update(member1, savedReview.getId(), updateRequest);

            // then
            assertAll(
                () -> assertThat(updatedReview.getId()).isNotNull(),
                () -> assertThat(updatedReview.getMember().getNickname()).isEqualTo("제이슨"),
                () -> assertThat(updatedReview.getQuestionAnswers().get(0).getAnswer().getValue())
                    .isEqualTo("editedAnswer1"),
                () -> assertThat(updatedReview.isPrivate()).isFalse()
            );
        }

        @Test
        @DisplayName("본인이 생성한 회고가 아니면 수정할 수 없다.")
        void notMine() throws InterruptedException {
            // given
            Review savedReview = saveReview(reviewForm1, member1, false);

            // when
            ReviewUpdateRequest updateRequest = new ReviewUpdateRequest(false, List.of(
                new ReviewContentUpdateRequest(1L, new AnswerUpdateRequest(1L, "editedAnswer1")),
                new ReviewContentUpdateRequest(2L, new AnswerUpdateRequest(2L, "editedAnswer2"))
            ));

            // then
            assertThatThrownBy(() -> reviewService.update(member2, savedReview.getId(), updateRequest))
                .isInstanceOf(AuthorizationException.class)
                .hasMessageContaining("본인이 생성한 회고가 아니면 수정할 수 없습니다.");
        }

        @Test
        @DisplayName("존재하지 않는 회고는 수정할 수 없다.")
        void invalidId() {
            // given
            ReviewUpdateRequest updateRequest = new ReviewUpdateRequest(false, List.of(
                new ReviewContentUpdateRequest(1L, new AnswerUpdateRequest(1L, "editedAnswer1")),
                new ReviewContentUpdateRequest(2L, new AnswerUpdateRequest(2L, "editedAnswer2"))
            ));

            // when, then
            assertThatThrownBy(() -> reviewService.update(member1, 99999L, updateRequest))
                .isInstanceOf(NotFoundException.class)
                .hasMessageContaining("존재하지 않는 회고입니다.");
        }

        @Test
        @DisplayName("유효하지 않은 질문 번호로 수정할 수 없다.")
        void withInvalidQuestionId() throws InterruptedException {
            // given
            Review savedReview = saveReview(reviewForm1, member1, false);

            ReviewUpdateRequest updateRequest = new ReviewUpdateRequest(false, List.of(
                new ReviewContentUpdateRequest(1L, new AnswerUpdateRequest(1L, "editedAnswer1")),
                new ReviewContentUpdateRequest(999L, new AnswerUpdateRequest(2L, "editedAnswer2"))
            ));

            // when, then
            assertThatThrownBy(() -> reviewService.update(member1, savedReview.getId(), updateRequest))
                .isInstanceOf(NotFoundException.class)
                .hasMessageContaining("존재하지 않는 질문입니다.");
        }

        @Test
        @DisplayName("유효하지 않은 답변 번호로 수정할 수 없다.")
        void withInvalidAnswerId() throws InterruptedException {
            // given
            Review savedReview = saveReview(reviewForm1, member1, false);

            ReviewUpdateRequest updateRequest = new ReviewUpdateRequest(false, List.of(
                new ReviewContentUpdateRequest(1L, new AnswerUpdateRequest(1L, "editedAnswer1")),
                new ReviewContentUpdateRequest(2L, new AnswerUpdateRequest(9999L, "editedAnswer2"))
            ));

            // when, then
            assertThatThrownBy(() -> reviewService.update(member1, savedReview.getId(), updateRequest))
                .isInstanceOf(NotFoundException.class)
                .hasMessageContaining("존재하지 않는 답변 번호입니다.");
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
            reviewService.delete(member1, savedReview.getId());

            // then
            assertThat(reviewService.findAllByCode(reviewForm1.getCode(), 0, 1)).hasSize(0);
        }

        @Test
        @DisplayName("본인이 생성한 회고가 아니면 삭제할 수 없다.")
        void notMine() throws InterruptedException {
            // given
            Review savedReview = saveReview(reviewForm1, member1, false);

            // when, then
            assertThatThrownBy(() -> reviewService.delete(member2, savedReview.getId()))
                .isInstanceOf(AuthorizationException.class)
                .hasMessageContaining("본인이 생성한 회고가 아니면 삭제할 수 없습니다.");
        }

        @Test
        @DisplayName("존재하지 않는 회고는 삭제할 수 없다.")
        void invalidId() {
            // when, then
            assertThatThrownBy(() -> reviewService.delete(member1, 99999L))
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
            Long id = savedReview.getId();

            // when
            int likeCount = 50;
            // 두 번 증가시킨다
            reviewService.increaseLikes(id, likeCount);
            int likes = reviewService.increaseLikes(id, likeCount);

            Review review = reviewService.findById(id);
            int actual = review.getLikes();

            // then
            assertAll(
                () -> assertThat(actual).isEqualTo(100),
                () -> assertThat(actual).isEqualTo(likes)
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
            Long id = savedReview.getId();

            // 초기 수정 시간
            // DB에 들어가서 뒷 자리수가 반올림 된 결과로 비교해야 하기 때문에 조회한다.
            LocalDateTime updatedAt = reviewService.findById(id).getUpdatedAt();
            // when
            reviewService.increaseLikes(id, 50);

            // 좋아요 더한 후 수정 시간
            LocalDateTime updatedAtAfterIncreaseLikes = reviewService.findById(id).getUpdatedAt();
            // then
            assertThat(updatedAtAfterIncreaseLikes.isEqual(updatedAt)).isTrue();
        }
    }

    private Review saveReview(ReviewForm reviewForm, Member member, boolean isPrivate) throws InterruptedException {
        Thread.sleep(1);

        ReviewCreateRequest reviewCreateRequest = new ReviewCreateRequest(isPrivate, List.of(
            new ReviewContentCreateRequest(
                reviewForm.getQuestions().get(0).getId(),
                new AnswerCreateRequest("answer1")
            ),
            new ReviewContentCreateRequest(
                reviewForm.getQuestions().get(1).getId(),
                new AnswerCreateRequest("answer2")
            )
        ));

        return reviewService.save(member, reviewForm.getCode(), reviewCreateRequest);
    }
}
