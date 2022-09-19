package com.reviewduck.review.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
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

    List<Review> findByIsPrivateFalseOrderByUpdatedAtDesc();

    Page<Review> findByMember(Member member, Pageable pageable);

    Page<Review> findByMemberAndIsPrivateFalse(Member member, Pageable pageable);

    @Modifying(clearAutomatically = true)
    @Query("update Review r set r.likes = r.likes + :likeCount where r.id = :#{#review.id}")
    void increaseLikes(Review review, int likeCount);

    void deleteById(Long id);
}
