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
import com.reviewduck.review.domain.Answer;
import com.reviewduck.review.domain.QuestionAnswer;
import com.reviewduck.review.domain.Review;
import com.reviewduck.review.domain.ReviewForm;
import com.reviewduck.review.domain.ReviewFormQuestion;

@DataJpaTest
@Import(JpaAuditingConfig.class)
public class ReviewRepositoryTest {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private ReviewFormRepository reviewFormRepository;

    @Autowired
    private MemberRepository memberRepository;

    private ReviewForm savedReviewForm;

    private Member savedMember;

    @BeforeEach
    void setUp() {
        Member member = new Member("1", "panda", "제이슨", "testUrl");
        savedMember = memberRepository.save(member);

        ReviewForm reviewForm = new ReviewForm(member, "title", List.of(
            new ReviewFormQuestion("question1", "description1"),
            new ReviewFormQuestion("question2", "description2")));
        savedReviewForm = reviewFormRepository.save(reviewForm);
    }

    @Test
    @DisplayName("리뷰를 저장한다.")
    void saveReview() {
        // when
        Review savedReview = saveReview(savedMember, savedReviewForm, "title");

        // then
        assertAll(
            () -> assertThat(savedReview.getId()).isNotNull(),
            () -> assertThat(savedReview.getMember().getNickname()).isEqualTo("제이슨"),
            () -> assertThat(savedReview.getQuestionAnswers().get(0).getAnswer().getValue())
                .isEqualTo("answer1")
        );
    }

    @Test
    @DisplayName("특정 회고 폼을 기반으로 작성된 회고를 모두 조회한다.")
    void findReviewsBySpecificReviewForm() {
        // given
        Review savedReview = saveReview(savedMember, savedReviewForm, "title");

        // when
        List<Review> reviews = reviewRepository.findByReviewForm(savedReviewForm);

        // then
        assertAll(
            () -> assertThat(reviews).hasSize(1),
            () -> assertThat(reviews.get(0).getMember().getNickname()).isEqualTo(savedReview.getMember().getNickname())
        );
    }

    @Test
    @DisplayName("개인이 작성한 회고를 updatedAt 내림차순으로 정렬하여 조회한다.")
    void findMemberReviewsOrderByUpdatedAtDesc() {
        // given
        saveReview(savedMember, savedReviewForm, "title");
        Review review = saveReview(savedMember, savedReviewForm, "title2");

        //when
        List<Review> myReviews = reviewRepository.findByMemberOrderByUpdatedAtDesc(savedMember);

        //then
        assertAll(
            () -> assertThat(myReviews).hasSize(2),
            () -> assertThat(myReviews.get(0)).isNotNull(),
            () -> assertThat(myReviews.get(0).getMember().getNickname()).isEqualTo(savedMember.getNickname()),
            () -> assertThat(myReviews.get(0).getTitle()).isEqualTo(review.getTitle())
        );
    }

    @Test
    @DisplayName("리뷰를 삭제한다.")
    void deleteReview() {
        // given
        Review savedReview = saveReview(savedMember, savedReviewForm, "title");

        // when
        reviewRepository.deleteById(savedReview.getId());

        // then
        assertThat(reviewRepository.findById(savedReview.getId()).isEmpty()).isTrue();
    }

    private Review saveReview(Member member, ReviewForm savedReviewForm, String title) {
        Review review = new Review(title, member, savedReviewForm,
            List.of(
                new QuestionAnswer(savedReviewForm.getReviewFormQuestions().get(0), new Answer("answer1")),
                new QuestionAnswer(savedReviewForm.getReviewFormQuestions().get(1), new Answer("answer2"))
            )
        );

        return reviewRepository.save(review);
    }
}
