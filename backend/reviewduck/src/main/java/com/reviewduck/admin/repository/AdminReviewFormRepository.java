package com.reviewduck.admin.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.repository.Repository;

import com.reviewduck.member.domain.Member;
import com.reviewduck.review.domain.ReviewForm;

public interface AdminReviewFormRepository extends Repository<ReviewForm, Long> {

    List<ReviewForm> findAll();

    List<ReviewForm> findAllByMember(Member member);

    ReviewForm findByCode(String reviewFormCode);

    Optional<ReviewForm> findById(Long reviewFormId);

    void delete(ReviewForm reviewForm);
}
