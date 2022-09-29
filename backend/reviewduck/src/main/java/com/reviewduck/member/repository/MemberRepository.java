package com.reviewduck.member.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;

import com.reviewduck.member.domain.Member;

public interface MemberRepository extends Repository<Member, Long> {

    Member save(Member member);

    Optional<Member> findById(Long id);

    Optional<Member> findBySocialId(String socialId);

    @Query("select m from Member m where m.id in (select distinct r.member.id from Review r where r.reviewForm in (select rf from ReviewForm rf where rf.code = :code))")
    List<Member> findAllParticipantsByReviewFormCode(String code);
}
