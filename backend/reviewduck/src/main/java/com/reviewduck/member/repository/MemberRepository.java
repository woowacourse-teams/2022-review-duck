package com.reviewduck.member.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.reviewduck.member.domain.Member;

public interface MemberRepository extends JpaRepository<Member, Long> {
    boolean existsBySocialId(String socialId);

    Optional<Member> findBySocialId(String socialId);
}
