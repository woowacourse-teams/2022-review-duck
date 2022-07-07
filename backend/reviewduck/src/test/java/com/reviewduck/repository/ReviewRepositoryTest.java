package com.reviewduck.repository;

import static org.assertj.core.api.Assertions.*;
import static org.junit.jupiter.api.Assertions.*;

import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import com.reviewduck.domain.Answer;
import com.reviewduck.domain.Review;
import com.reviewduck.domain.ReviewForm;

@DataJpaTest
public class ReviewRepositoryTest {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private ReviewFormRepository reviewFormRepository;

    @Test
    @DisplayName("리뷰를 저장한다.")
    void saveReview() {
        // given
        ReviewForm reviewForm = new ReviewForm("title", List.of("question1", "question2"));
        ReviewForm savedReviewForm = reviewFormRepository.save(reviewForm);

        // when
        Review review = Review.of("제이슨", savedReviewForm,
            Map.of(reviewForm.getQuestions().get(0), new Answer("answer1"),
                reviewForm.getQuestions().get(1), new Answer("answer2")));
        Review savedReview = reviewRepository.save(review);

        // then
        assertAll(
            () -> assertThat(savedReview.getId()).isNotNull(),
            () -> assertThat(savedReview.getNickname()).isEqualTo("제이슨"),
            () -> assertThat(savedReview.getAnswersByQuestions()
                .get(savedReviewForm.getQuestions().get(0)).getValue()).isEqualTo("answer1")
        );
    }

    @Test
    @DisplayName("특정 회고 폼을 기반으로 작성된 회고를 모두 조회한다.")
    void findReviewsBySpecificReviewForm() {
        // given
        ReviewForm reviewForm = new ReviewForm("title", List.of("question1", "question2"));
        ReviewForm savedReviewForm = reviewFormRepository.save(reviewForm);
        String code = savedReviewForm.getCode();

        Review review = Review.of("제이슨", savedReviewForm,
            Map.of(reviewForm.getQuestions().get(0), new Answer("answer1"),
                reviewForm.getQuestions().get(1), new Answer("answer2")));
        Review savedReview = reviewRepository.save(review);

        // when
        List<Review> reviews = reviewRepository.findByReviewForm(savedReviewForm);

        // then
        assertAll(
            () -> assertThat(reviews).hasSize(1),
            () -> assertThat(reviews.get(0).getNickname()).isEqualTo(savedReview.getNickname())
        );
    }
}
