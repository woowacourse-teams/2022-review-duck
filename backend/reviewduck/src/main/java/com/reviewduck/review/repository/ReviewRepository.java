package com.reviewduck.review.repository;

import java.util.List;
import java.util.Optional;

import org.hibernate.annotations.BatchSize;
import org.hibernate.annotations.JoinColumnOrFormula;
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

    Page<Review> findByReviewForm(ReviewForm reviewForm, Pageable pageable);

    @Query("select r from Review r join fetch r.member where r.reviewForm.code = :reviewFormCode")
    List<Review> findAllByReviewFormCode(String reviewFormCode);

    Page<Review> findByIsPrivateFalse(Pageable pageable);

    Page<Review> findByMember(Member member, Pageable pageable);

    Page<Review> findByMemberAndIsPrivateFalse(Member member, Pageable pageable);

    @Modifying(clearAutomatically = true)
    @Query("update Review r set r.likes = r.likes + :likeCount where r.id = :#{#review.id}")
    void increaseLikes(Review review, int likeCount);

    void deleteById(Long id);
}
