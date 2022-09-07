package com.reviewduck.review.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.reviewduck.member.domain.Member;
import com.reviewduck.review.domain.Review;
import com.reviewduck.review.domain.ReviewForm;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    List<Review> findByReviewForm(ReviewForm reviewForm);

    List<Review> findByMemberOrderByUpdatedAtDesc(Member member);

    List<Review> findByMemberAndIsPrivateFalseOrderByUpdatedAtDesc(Member member);

    List<Review> findAllByMember(Member member);

    List<Review> findByIsPrivateFalseOrderByUpdatedAtDesc();
}
