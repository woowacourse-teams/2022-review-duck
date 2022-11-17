package com.reviewduck.member.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;

import com.reviewduck.member.domain.Member;
import com.reviewduck.review.domain.ReviewForm;

public interface MemberRepository extends Repository<Member, Long> {

    Member save(Member member);

    Optional<Member> findById(long id);

    Optional<Member> findBySocialId(String socialId);

    @Query("select m from Member m where m.id in (select distinct r.member.id from Review r where r.reviewForm = :form)")
    List<Member> findAllParticipantsByReviewForm(ReviewForm form);
}
