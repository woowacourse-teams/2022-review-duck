package com.reviewduck.review.service;

import static org.assertj.core.api.Assertions.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.List;
import java.util.stream.Collectors;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.reviewduck.auth.exception.AuthorizationException;
import com.reviewduck.common.exception.NotFoundException;
import com.reviewduck.common.service.ServiceTest;
import com.reviewduck.member.domain.Member;
import com.reviewduck.member.dto.MemberDto;
import com.reviewduck.review.domain.Answer;
import com.reviewduck.review.domain.Review;
import com.reviewduck.review.domain.ReviewForm;
import com.reviewduck.review.domain.ReviewFormQuestion;
import com.reviewduck.review.dto.controller.request.ReviewFormCreateRequest;
import com.reviewduck.review.dto.controller.request.ReviewFormQuestionCreateRequest;
import com.reviewduck.review.dto.controller.request.ReviewFormQuestionUpdateRequest;
import com.reviewduck.review.dto.controller.request.ReviewFormUpdateRequest;
import com.reviewduck.review.dto.controller.response.MemberReviewFormsResponse;
import com.reviewduck.review.dto.controller.response.ReviewFormCodeResponse;
import com.reviewduck.review.dto.controller.response.ReviewFormResponse;
import com.reviewduck.review.dto.service.QuestionAnswerCreateDto;
import com.reviewduck.review.dto.service.ReviewFormQuestionCreateDto;
import com.reviewduck.review.repository.ReviewFormRepository;
import com.reviewduck.review.repository.ReviewRepository;

public class ReviewFormServiceTest extends ServiceTest {

    private final String invalidCode = "aaaaaaaa";
    private final ReviewForm mockReviewForm = mock(ReviewForm.class);

    @Autowired
    private ReviewFormService reviewFormService;

    @Autowired
    private ReviewFormRepository reviewFormRepository;

    @Autowired
    private ReviewRepository reviewRepository;

    @Nested
    @DisplayName("회고 폼 생성")
    @Transactional(propagation = Propagation.NOT_SUPPORTED)
    class saveReviewForm {

        @Test
        @DisplayName("회고 폼을 생성한다.")
        void saveReviewForm() {
            // given
            String reviewFormTitle = "title";
            List<ReviewFormQuestionCreateRequest> questions = List.of(
                new ReviewFormQuestionCreateRequest("question1", "description1"),
                new ReviewFormQuestionCreateRequest("question2", "description2"));

            ReviewFormCreateRequest createRequest = new ReviewFormCreateRequest(reviewFormTitle, questions);

            List<ReviewFormQuestion> expected = questions.stream()
                .map(questionRequest -> new ReviewFormQuestion(
                    questionRequest.getValue(),
                    questionRequest.getDescription(), mockReviewForm))
                .collect(Collectors.toUnmodifiableList());

            int index = 0;
            for (ReviewFormQuestion reviewFormQuestion : expected) {
                reviewFormQuestion.setPosition(index++);
            }

            // when
            ReviewFormCodeResponse response = reviewFormService.save(memberId1, createRequest);

            // then
            assertThat(response.getReviewFormCode()).isNotNull();
        }

    }

    @Nested
    @DisplayName("회고 폼 코드로 회고 폼 조회")
    @Transactional(propagation = Propagation.NOT_SUPPORTED)
    class findByCode {

        @Test
        @DisplayName("회고 폼 코드로 회고 폼을 조회한다.")
        void findReviewForm() throws InterruptedException {
            // given
            ReviewForm reviewForm = saveReviewForm(member1);

            // when
            ReviewFormResponse response = reviewFormService.findByCode(reviewForm.getCode(), member1.getId());

            // then
            assertAll(
                () -> assertThat(response.getReviewFormTitle()).isEqualTo(reviewForm.getTitle()),
                () -> assertThat(response.getCreator().getId()).isEqualTo(member1.getId())
            );
        }

        @Test
        @DisplayName("존재하지 않는 코드로 조회할 수 없다.")
        void findReviewFormByInvalidCode() {
            // when, then
            assertThatThrownBy(() -> reviewFormService.findByCode(invalidCode, member1.getId()))
                .isInstanceOf(NotFoundException.class)
                .hasMessageContaining("존재하지 않는 회고 폼입니다.");
        }

    }

    @Nested
    @DisplayName("사용자가 생성한 회고 폼 조회")
    class findMemberReviewForm {

        @Test
        @DisplayName("자신이 작성한 회고 질문지 중 최신순으로 첫 페이지를 조회한다.")
        void findPageOfReviewsFormsOrderByLatest() throws InterruptedException {
            // given
            MemberDto member = MemberDto.from(member1);
            saveReviewForm(member1);
            ReviewForm expected = saveReviewForm(member1);

            // when
            int page = 0;
            int size = 1;

            MemberReviewFormsResponse myReviewForms = reviewFormService.findBySocialId(
                member1.getSocialId(), page, size, member);

            // then
            assertAll(
                () -> assertThat(myReviewForms.getReviewForms()).hasSize(1),
                () -> assertThat(myReviewForms.getReviewForms().get(0).getCode()).isEqualTo(expected.getCode()),
                () -> assertThat(myReviewForms.getIsMine()).isTrue()
            );
        }

        @Test
        @DisplayName("삭제한 회고는 조회 대상에서 제외된다.")
        void findReviewFormsExceptDeleted() throws InterruptedException {
            // given
            MemberDto member = MemberDto.from(member1);
            ReviewForm expected = saveReviewForm(member1);
            ReviewForm reviewForm = saveReviewForm(member1);

            reviewFormService.deleteByCode(memberId1, reviewForm.getCode());

            // when
            int page = 0;
            int size = 1;

            MemberReviewFormsResponse myReviewForms = reviewFormService.findBySocialId(
                member1.getSocialId(), page, size, member);

            // then
            assertAll(
                () -> assertThat(myReviewForms.getReviewForms()).hasSize(1),
                () -> assertThat(myReviewForms.getReviewForms().get(0).getCode()).isEqualTo(expected.getCode()),
                () -> assertThat(myReviewForms.getIsMine()).isTrue()
            );
        }
    }

    @Nested
    @DisplayName("회고 폼 수정")
    class updateReviewForm {

        @Test
        @DisplayName("회고 폼을 수정한다.")
        void updateReviewForm() throws InterruptedException {
            // given
            ReviewForm savedReviewForm = saveReviewForm(member1);
            String code = savedReviewForm.getCode();
            long questionId = savedReviewForm.getQuestions().get(0).getId();

            // when
            String reviewFormTitle = "new title";
            List<ReviewFormQuestionUpdateRequest> updateRequests = List.of(
                new ReviewFormQuestionUpdateRequest(questionId, "new question1", "new description1"),
                new ReviewFormQuestionUpdateRequest(null, "new question3", "new description3"));

            ReviewFormUpdateRequest updateRequest = new ReviewFormUpdateRequest(reviewFormTitle, updateRequests);

            reviewFormService.update(memberId1, code, updateRequest);
            ReviewFormResponse foundReviewForm = reviewFormService.findByCode(code, memberId1);

            assertAll(
                () -> assertThat(foundReviewForm).isNotNull(),
                () -> assertThat(foundReviewForm.getReviewFormTitle()).isEqualTo(reviewFormTitle),
                () -> assertThat(foundReviewForm.getQuestions()).hasSize(2),
                () -> assertThat(foundReviewForm.getQuestions().get(0).getValue()).isEqualTo("new question1"),
                () -> assertThat(foundReviewForm.getQuestions().get(1).getValue()).isEqualTo("new question3")
            );
        }

        @Test
        @DisplayName("본인이 생성한 회고 폼이 아니면 수정할 수 없다.")
        void updateNotMyReviewForm() throws InterruptedException {
            // given
            ReviewForm savedReviewForm = saveReviewForm(member1);
            String code = savedReviewForm.getCode();
            long questionId = savedReviewForm.getQuestions().get(0).getId();

            // when
            String reviewFormTitle = "new title";
            List<ReviewFormQuestionUpdateRequest> updateRequests = List.of(
                new ReviewFormQuestionUpdateRequest(questionId, "new question1", "new description1"),
                new ReviewFormQuestionUpdateRequest(null, "new question3", "new description3"));

            ReviewFormUpdateRequest updateRequest = new ReviewFormUpdateRequest(reviewFormTitle, updateRequests);

            List<ReviewFormQuestion> expected = updateRequests.stream()
                .map(questionRequest -> new ReviewFormQuestion(questionRequest.getValue(), "", mockReviewForm))
                .collect(Collectors.toUnmodifiableList());

            int index = 0;
            for (ReviewFormQuestion reviewFormQuestion : expected) {
                reviewFormQuestion.setPosition(index++);
            }

            assertThatThrownBy(() -> reviewFormService.update(memberId2, code, updateRequest))
                .isInstanceOf(AuthorizationException.class)
                .hasMessageContaining("본인이 생성한 회고 폼이 아니면 수정할 수 없습니다.");
        }

        @Test
        @DisplayName("존재하지 않는 회고 폼을 수정할 수 없다.")
        void updateReviewFormByInvalidCode() {
            // when
            List<ReviewFormQuestionUpdateRequest> updateRequests = List.of(
                new ReviewFormQuestionUpdateRequest(1L, "new question1", "new description1"),
                new ReviewFormQuestionUpdateRequest(null, "new question3", "new description3"),
                new ReviewFormQuestionUpdateRequest(2L, "new question2", "new description2"));

            ReviewFormUpdateRequest reviewFormUpdateRequest = new ReviewFormUpdateRequest("new title", updateRequests);

            assertThatThrownBy(() -> reviewFormService.update(memberId1, invalidCode, reviewFormUpdateRequest))
                .isInstanceOf(NotFoundException.class)
                .hasMessageContaining("존재하지 않는 회고 폼입니다.");
        }

        @Test
        @DisplayName("존재하지 않는 질문을 수정할 수 없다.")
        void updateReviewFormByInvalidQuestionId() throws InterruptedException {
            // given
            String code = saveReviewForm(member1).getCode();

            // when, then
            List<ReviewFormQuestionUpdateRequest> updateRequests = List.of(
                new ReviewFormQuestionUpdateRequest(9999999L, "new question", "new description"));

            assertThatThrownBy(
                () -> reviewFormService.update(memberId1, code,
                    new ReviewFormUpdateRequest("new title", updateRequests)))
                .isInstanceOf(NotFoundException.class)
                .hasMessageContaining("존재하지 않는 질문입니다.");
        }

    }

    @Nested
    @DisplayName("회고 폼 코드로 회고 폼 삭제")
    class deleteByCode {

        @Test
        @DisplayName("회고 폼을 삭제한다(생성한 회고 있는 상태).")
        void deleteReviewForm_reviewExists() throws InterruptedException {
            // given
            ReviewForm savedReviewForm = saveReviewForm(member1);
            String code = savedReviewForm.getCode();
            saveReview(member1, savedReviewForm);

            // when
            reviewFormService.deleteByCode(memberId1, code);

            // then
            assertThatThrownBy(() -> reviewFormService.findByCode(code, member1.getId()))
                .isInstanceOf(NotFoundException.class)
                .hasMessageContaining("존재하지 않는 회고 폼입니다.");
        }

        @Test
        @DisplayName("회고 폼을 삭제한다(생성한 회고 없는 상태).")
        void deleteReviewForm_reviewNotExists() throws InterruptedException {
            // given
            ReviewForm savedReviewForm = saveReviewForm(member1);
            String code = savedReviewForm.getCode();

            // when
            reviewFormService.deleteByCode(memberId1, code);

            // then
            assertThatThrownBy(() -> reviewFormService.findByCode(code, member1.getId()))
                .isInstanceOf(NotFoundException.class)
                .hasMessageContaining("존재하지 않는 회고 폼입니다.");
        }

        @Test
        @DisplayName("본인이 생성한 회고 폼이 아니면 삭제할 수 없다.")
        void deleteNotMyReviewForm() throws InterruptedException {
            // given
            ReviewForm savedReviewForm = saveReviewForm(member1);
            String code = savedReviewForm.getCode();

            // when, then
            assertThatThrownBy(() -> reviewFormService.deleteByCode(memberId2, code))
                .isInstanceOf(AuthorizationException.class)
                .hasMessageContaining("본인이 생성한 회고 폼이 아니면 삭제할 수 없습니다.");
        }

        @Test
        @DisplayName("존재하지 않는 회고 폼을 삭제할 수 없다.")
        void deleteReviewFormByInvalidCode() {
            // when, then
            assertThatThrownBy(() -> reviewFormService.deleteByCode(memberId1, invalidCode))
                .isInstanceOf(NotFoundException.class)
                .hasMessageContaining("존재하지 않는 회고 폼입니다.");
        }

    }

    private ReviewForm saveReviewForm(Member member) throws InterruptedException {
        Thread.sleep(1);

        List<ReviewFormQuestionCreateDto> questions = List.of(
            new ReviewFormQuestionCreateDto("question1", "description1"),
            new ReviewFormQuestionCreateDto("question2", "description2")
        );

        ReviewForm reviewForm = new ReviewForm(member, "title", questions);
        return reviewFormRepository.save(reviewForm);
    }

    private void saveReview(Member member, ReviewForm reviewForm) {
        List<QuestionAnswerCreateDto> questionAnswers = reviewForm.getQuestions().stream()
            .map(it -> new QuestionAnswerCreateDto(it, new Answer("answer")))
            .collect(Collectors.toUnmodifiableList());

        Review review = new Review("title", member, reviewForm, questionAnswers, false);

        reviewRepository.save(review);
    }

}
