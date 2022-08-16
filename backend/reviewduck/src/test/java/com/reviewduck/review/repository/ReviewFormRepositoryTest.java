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

    private Member member2;

    @BeforeEach
    void setUp() {
        Member memberA = new Member("12345", "panda", "제이슨", "testUrl");
        member1 = memberRepository.save(memberA);

        Member memberB = new Member("56789", "ariari", "브리", "testUrl2");
        member2 = memberRepository.save(memberB);
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
    @DisplayName("개인이 작성한 회고 폼을 조회한다.")
    void findMyReviewForms() {
        // given
        saveReviewForm(member1);
        saveReviewForm(member2);

        // when
        List<ReviewForm> myReviewForms = reviewFormRepository.findByMember(member1);

        // then
        assertAll(
            () -> assertThat(myReviewForms).hasSize(1),
            () -> assertThat(myReviewForms.get(0)).isNotNull(),
            () -> assertThat(myReviewForms.get(0).getMember().getNickname()).isEqualTo("제이슨")
        );
    }

    @Test
    @DisplayName("삭제된 회고 폼을 코드로 조회할 수 없다.")
    void NotFoundDeletedReviewFormByCode() {
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
    void NotFoundDeletedReviewFormByMember() {
        // given
        ReviewForm reviewForm = saveReviewForm(member1);

        // when
        reviewFormRepository.delete(reviewForm);

        // then
        assertThat(reviewFormRepository.findByMember(member1).isEmpty()).isTrue();
    }

    private ReviewForm saveReviewForm(Member member) {
        List<ReviewFormQuestion> questions = List.of(
            new ReviewFormQuestion("question1", "description1"),
            new ReviewFormQuestion("question2", "description2"));

        return reviewFormRepository.save(new ReviewForm(member, "title", questions));
    }
}
