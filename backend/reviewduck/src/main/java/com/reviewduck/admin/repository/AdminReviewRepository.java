package com.reviewduck.admin.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.repository.Repository;

import com.reviewduck.member.domain.Member;
import com.reviewduck.review.domain.Review;

public interface AdminReviewRepository extends Repository<Review, Long> {

    List<Review> findAll();

    List<Review> findAllByMember(Member member);

    Optional<Review> findById(Long reviewId);

    void deleteById(Long reviewId);
}
