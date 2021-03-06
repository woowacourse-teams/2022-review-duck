package com.reviewduck.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.reviewduck.domain.Review;
import com.reviewduck.domain.ReviewForm;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByReviewForm(ReviewForm reviewForm);
}
