package com.reviewduck.review.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;

import com.reviewduck.member.domain.Member;
import com.reviewduck.review.domain.ReviewForm;

public interface ReviewFormRepository extends Repository<ReviewForm, Long> {

    ReviewForm save(ReviewForm reviewForm);

    Optional<ReviewForm> findByCodeAndIsActiveTrue(String code);

    Page<ReviewForm> findByMemberAndIsActiveTrue(Member member, PageRequest pageable);

    @Modifying
    @Query("update ReviewForm r set r.isActive = false where r.id = :#{#reviewForm.id}")
    void deleteSoftly(ReviewForm reviewForm);

    void delete(ReviewForm reviewForm);
}
