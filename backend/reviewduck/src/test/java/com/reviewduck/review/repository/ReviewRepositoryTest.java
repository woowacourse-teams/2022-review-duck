package com.reviewduck.review.repository;

import static org.assertj.core.api.Assertions.*;
import static org.junit.jupiter.api.Assertions.*;

import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import com.reviewduck.member.domain.Member;
import com.reviewduck.member.repository.MemberRepository;
import com.reviewduck.review.domain.Answer;
import com.reviewduck.review.domain.QuestionAnswer;
import com.reviewduck.review.domain.Review;
import com.reviewduck.review.domain.ReviewForm;

@DataJpaTest
public class ReviewRepositoryTest {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private ReviewFormRepository reviewFormRepository;

    @Autowired
    private MemberRepository memberRepository;

    private ReviewForm savedReviewForm;
    private Review review;

    @BeforeEach
    void setUp() {
        Member member = new Member("1", "panda", "제이슨", "testUrl");
        memberRepository.save(member);
        ReviewForm reviewForm = new ReviewForm(member, "title", List.of("question1", "question2"));
        this.savedReviewForm = reviewFormRepository.save(reviewForm);
        this.review = new Review("title", member, savedReviewForm,
            List.of(
                new QuestionAnswer(savedReviewForm.getReviewFormQuestions().get(0), new Answer("answer1")),
                new QuestionAnswer(savedReviewForm.getReviewFormQuestions().get(1), new Answer("answer2"))
            )
        );
    }

    @Test
    @DisplayName("리뷰를 저장한다.")
    void saveReview() {
        // when
        Review savedReview = reviewRepository.save(review);

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
        Review savedReview = reviewRepository.save(review);

        // when
        List<Review> reviews = reviewRepository.findByReviewForm(savedReviewForm);

        // then
        assertAll(
            () -> assertThat(reviews).hasSize(1),
            () -> assertThat(reviews.get(0).getMember().getNickname()).isEqualTo(savedReview.getMember().getNickname())
        );
    }

    @Test
    @DisplayName("리뷰를 삭제한다.")
    void deleteReview() {
        // given
        Review savedReview = reviewRepository.save(review);

        // when
        reviewRepository.deleteById(savedReview.getId());

        // then
        assertThat(reviewRepository.findById(savedReview.getId()).isEmpty()).isTrue();
    }

    @Test
    @DisplayName("개인이 작성한 회고를 조회한다.")
    void findMyReviewForms() {
        // given
        reviewRepository.save(review);

        Member member2 = new Member("1", "ariari", "브리", "testUrl2");
        memberRepository.save(member2);
        ReviewForm reviewForm = new ReviewForm(member2, "title", List.of("question1", "question2"));
        ReviewForm savedReviewForm = reviewFormRepository.save(reviewForm);
        Review review2 = new Review("title", member2, savedReviewForm,
            List.of(
                new QuestionAnswer(savedReviewForm.getReviewFormQuestions().get(0), new Answer("answer3")),
                new QuestionAnswer(savedReviewForm.getReviewFormQuestions().get(1), new Answer("answer4"))
            )
        );
        reviewRepository.save(review2);

        //when
        List<Review> myReviews = reviewRepository.findByMember(member2);

        //then
        assertAll(
            () -> assertThat(myReviews).hasSize(1),
            () -> assertThat(myReviews.get(0)).isNotNull(),
            () -> assertThat(myReviews.get(0).getMember().getNickname()).isEqualTo("브리"),
            () -> assertThat(myReviews.get(0).getQuestionAnswers().get(0).getAnswer().getValue()).isEqualTo("answer3")
        );
    }
}
