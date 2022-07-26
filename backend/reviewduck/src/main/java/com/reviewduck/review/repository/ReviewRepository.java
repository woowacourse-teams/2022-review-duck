package com.reviewduck.review.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.reviewduck.review.domain.Review;
import com.reviewduck.review.domain.ReviewForm;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByReviewForm(ReviewForm reviewForm);
}
