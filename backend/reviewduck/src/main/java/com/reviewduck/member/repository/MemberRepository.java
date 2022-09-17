package com.reviewduck.member.repository;

import java.util.Optional;

import org.springframework.data.repository.Repository;

import com.reviewduck.member.domain.Member;

public interface MemberRepository extends Repository<Member, Long> {

    Member save(Member member);

    Optional<Member> findById(Long id);

    Optional<Member> findBySocialId(String socialId);
}
