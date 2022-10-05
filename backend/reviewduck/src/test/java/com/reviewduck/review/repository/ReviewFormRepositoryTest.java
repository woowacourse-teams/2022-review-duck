package com.reviewduck.review.repository;

import static org.assertj.core.api.Assertions.*;
import static org.junit.jupiter.api.Assertions.*;

import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.context.annotation.Import;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;

import com.reviewduck.config.JpaAuditingConfig;
import com.reviewduck.member.domain.Member;
import com.reviewduck.member.repository.MemberRepository;
import com.reviewduck.review.domain.ReviewForm;
import com.reviewduck.review.domain.ReviewFormQuestion;
import com.reviewduck.review.service.ReviewFormQuestionCreateDto;

@DataJpaTest
@Import(JpaAuditingConfig.class)
public class ReviewFormRepositoryTest {

    @Autowired
    private ReviewFormRepository reviewFormRepository;

    @Autowired
    private MemberRepository memberRepository;

    private Member member1;

    @BeforeEach
    void setUp() {
        Member memberA = new Member("12345", "panda", "제이슨", "testUrl");
        member1 = memberRepository.save(memberA);
    }

    @Test
    @DisplayName("회고 질문지를 저장한다.")
    void saveReviewForm() {

        // given
        List<ReviewFormQuestionCreateDto> questions = List.of(
            new ReviewFormQuestionCreateDto("question1", "description1"),
            new ReviewFormQuestionCreateDto("question2", "description2"));
        ReviewForm reviewForm = new ReviewForm(member1, "title", questions);

        // when
        ReviewForm savedReviewForm = reviewFormRepository.save(reviewForm);

        // then
        assertAll(
            () -> assertThat(savedReviewForm.getId()).isNotNull(),
            () -> assertThat(savedReviewForm.getMember().getSocialNickname()).isEqualTo("panda"),
            () -> assertThat(savedReviewForm.getCode().length()).isEqualTo(8),
            () -> assertThat(savedReviewForm.getQuestions())
                .usingRecursiveComparison()
                .ignoringFields("id", "reviewForm", "position")
                .isEqualTo(questions)
        );
    }

    @Test
    @DisplayName("자신이 작성한 회고 질문지 중 최신순으로 첫 페이지를 조회한다.")
    void findPageOfMemberReviewForms() throws InterruptedException {
        // given
        saveReviewForm(member1);
        ReviewForm expected = saveReviewForm(member1);

        // when
        int page = 0;
        int size = 3;
        String sortType = "updatedAt";
        PageRequest pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, sortType));

        List<ReviewForm> myReviewForms = reviewFormRepository.findByMemberAndIsActiveTrue(member1, pageable)
            .getContent();

        // then
        assertAll(
            () -> assertThat(myReviewForms).hasSize(2),
            () -> assertThat(myReviewForms.get(0)).isNotNull(),
            () -> assertThat(myReviewForms.get(0).getMember().getNickname()).isEqualTo("제이슨"),
            () -> assertThat(myReviewForms.get(0).getTitle()).isEqualTo(expected.getTitle())
        );
    }

    @Test
    @DisplayName("회고 질문지 조회 시 삭제된 회고 질문지는 제외한다.")
    void findReviewExceptDelete() throws InterruptedException {
        // given
        ReviewForm expected = saveReviewForm(member1);
        ReviewForm reviewForm = saveReviewForm(member1);

        reviewFormRepository.delete(reviewForm);

        // when
        int page = 0;
        int size = 3;
        String sortType = "updatedAt";
        PageRequest pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, sortType));

        List<ReviewForm> myReviewForms = reviewFormRepository.findByMemberAndIsActiveTrue(member1, pageable)
            .getContent();

        // then
        assertAll(
            () -> assertThat(myReviewForms).hasSize(1),
            () -> assertThat(myReviewForms.get(0)).isNotNull(),
            () -> assertThat(myReviewForms.get(0).getMember().getNickname()).isEqualTo("제이슨"),
            () -> assertThat(myReviewForms.get(0).getTitle()).isEqualTo(expected.getTitle())
        );
    }

    @Test
    @DisplayName("삭제된 회고 폼을 코드로 조회할 수 없다.")
    void NotFoundDeletedReviewFormByCode() throws InterruptedException {
        // given
        ReviewForm reviewForm = saveReviewForm(member1);
        String reviewFormCode = reviewForm.getCode();

        // when
        reviewFormRepository.delete(reviewForm);

        // then
        assertThat(reviewFormRepository.findByCodeAndIsActiveTrue(reviewFormCode).isEmpty()).isTrue();
    }

    private ReviewForm saveReviewForm(Member member) throws InterruptedException {
        Thread.sleep(1);

        List<ReviewFormQuestionCreateDto> questions = List.of(
            new ReviewFormQuestionCreateDto("question1", "description1"),
            new ReviewFormQuestionCreateDto("question2", "description2"));

        return reviewFormRepository.save(new ReviewForm(member, "title", questions));
    }
}
