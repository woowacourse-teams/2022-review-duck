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

import com.reviewduck.config.JpaAuditingConfig;
import com.reviewduck.member.domain.Member;
import com.reviewduck.member.repository.MemberRepository;
import com.reviewduck.review.domain.ReviewForm;
import com.reviewduck.review.domain.ReviewFormQuestion;

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
    @DisplayName("리뷰 폼을 저장한다.")
    void saveReviewForm() {

        // given
        List<ReviewFormQuestion> questions = List.of(
            new ReviewFormQuestion("question1", "description1"),
            new ReviewFormQuestion("question2", "description2"));
        ReviewForm reviewForm = new ReviewForm(member1, "title", questions);

        // when
        ReviewForm savedReviewForm = reviewFormRepository.save(reviewForm);

        // then
        assertAll(
            () -> assertThat(savedReviewForm.getId()).isNotNull(),
            () -> assertThat(savedReviewForm.getMember().getSocialNickname()).isEqualTo("panda"),
            () -> assertThat(savedReviewForm.getCode().length()).isEqualTo(8),
            () -> assertThat(savedReviewForm.getReviewFormQuestions())
                .usingRecursiveComparison()
                .ignoringFields("id")
                .isEqualTo(questions)
        );
    }

    @Test
    @DisplayName("사용자가 작성한 회고 폼을 updatedAt 내림차순으로 정렬하여 조회한다.")
    void findMemberReviewForms() throws InterruptedException {
        // given
        saveReviewForm(member1);
        ReviewForm expected = saveReviewForm(member1);

        // when
        List<ReviewForm> myReviewForms = reviewFormRepository.findByMemberOrderByUpdatedAtDesc(member1);

        // then
        assertAll(
            () -> assertThat(myReviewForms).hasSize(2),
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
        assertThat(reviewFormRepository.findByCode(reviewFormCode).isEmpty()).isTrue();
    }

    @Test
    @DisplayName("삭제된 회고 폼을 멤버로 조회할 수 없다.")
    void NotFoundDeletedReviewFormByMember() throws InterruptedException {
        // given
        ReviewForm reviewForm = saveReviewForm(member1);

        // when
        reviewFormRepository.delete(reviewForm);

        // then
        assertThat(reviewFormRepository.findByMemberOrderByUpdatedAtDesc(member1).isEmpty()).isTrue();
    }

    private ReviewForm saveReviewForm(Member member) throws InterruptedException {
        Thread.sleep(1);

        List<ReviewFormQuestion> questions = List.of(
            new ReviewFormQuestion("question1", "description1"),
            new ReviewFormQuestion("question2", "description2"));

        return reviewFormRepository.save(new ReviewForm(member, "title", questions));
    }
}
