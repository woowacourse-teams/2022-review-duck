package com.reviewduck.admin.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.repository.Repository;

import com.reviewduck.member.domain.Member;
import com.reviewduck.review.domain.Review;
import com.reviewduck.review.domain.ReviewForm;

public interface AdminReviewRepository extends Repository<Review, Long> {

    List<Review> findAll();

    List<Review> findAllByMember(Member member);

    List<Review> findAllByReviewForm(ReviewForm reviewForm);

    Optional<Review> findById(Long reviewId);

    void delete(Review review);
}
