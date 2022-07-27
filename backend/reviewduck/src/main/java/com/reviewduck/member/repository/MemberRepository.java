package com.reviewduck.member.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.reviewduck.member.domain.Member;

public interface MemberRepository extends JpaRepository<Member, Long> {
    boolean existsBySocialId(String socialId);

    Member findBySocialId(String socialId);
}
