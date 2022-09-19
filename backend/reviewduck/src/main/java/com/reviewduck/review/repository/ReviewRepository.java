package com.reviewduck.review.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.Repository;

import com.reviewduck.member.domain.Member;
import com.reviewduck.review.domain.Review;
import com.reviewduck.review.domain.ReviewForm;

public interface ReviewRepository extends Repository<Review, Long> {

    Review save(Review review);

    Optional<Review> findById(long reviewId);

    List<Review> findByReviewForm(ReviewForm reviewForm);

    List<Review> findByMemberOrderByUpdatedAtDesc(Member member);

    List<Review> findByMemberAndIsPrivateFalseOrderByUpdatedAtDesc(Member member);

    List<Review> findAllByMember(Member member);

    Page<Review> findByIsPrivateFalse(Pageable pageable);

    Page<Review> findByMember(Member member, Pageable pageable);

    Page<Review> findByMemberAndIsPrivateFalse(Member member, Pageable pageable);

    void deleteById(Long id);
}
