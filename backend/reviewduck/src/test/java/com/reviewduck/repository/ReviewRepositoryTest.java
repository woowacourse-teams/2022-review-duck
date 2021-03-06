package com.reviewduck.repository;

import static org.assertj.core.api.Assertions.*;
import static org.junit.jupiter.api.Assertions.*;

import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import com.reviewduck.domain.Answer;
import com.reviewduck.domain.QuestionAnswer;
import com.reviewduck.domain.Review;
import com.reviewduck.domain.ReviewForm;

@DataJpaTest
public class ReviewRepositoryTest {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private ReviewFormRepository reviewFormRepository;

    private ReviewForm savedReviewForm;
    private Review review;

    @BeforeEach
    void setUp() {
        ReviewForm reviewForm = new ReviewForm("title", List.of("question1", "question2"));
        this.savedReviewForm = reviewFormRepository.save(reviewForm);
        this.review = Review.of("제이슨", savedReviewForm,
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
            () -> assertThat(savedReview.getNickname()).isEqualTo("제이슨"),
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
            () -> assertThat(reviews.get(0).getNickname()).isEqualTo(savedReview.getNickname())
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
}
