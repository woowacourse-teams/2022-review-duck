package com.reviewduck.review.repository;

import java.util.List;
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

    @Query("select r from ReviewForm r where r.code = :code and r.isActive = true")
    Optional<ReviewForm> findByCode(String code);

    @Query("select r from ReviewForm r where r.member = :member and r.isActive = true order by r.updatedAt desc")
    List<ReviewForm> findByMemberOrderByUpdatedAtDesc(Member member);

    List<ReviewForm> findAllByMember(Member member);

    Page<ReviewForm> findByMember(Member member, PageRequest pageable);

    @Modifying
    @Query("update ReviewForm r set r.isActive = false where r.id = :#{#reviewForm.id}")
    void delete(ReviewForm reviewForm);
}
