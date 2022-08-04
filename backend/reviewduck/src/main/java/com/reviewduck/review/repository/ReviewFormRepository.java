package com.reviewduck.review.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import com.reviewduck.member.domain.Member;
import com.reviewduck.review.domain.ReviewForm;

public interface ReviewFormRepository extends JpaRepository<ReviewForm, Long> {

    @Query("select r from ReviewForm r where r.code = :code and r.isActive = true")
    Optional<ReviewForm> findByCode(String code);

    @Query("select r from ReviewForm r where r.member = :member and r.isActive = true")
    List<ReviewForm> findByMember(Member member);

    @Modifying
    @Query("update ReviewForm r set r.isActive = false where r.id = :id")
    void delete(Long id);
}
