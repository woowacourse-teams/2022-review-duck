package com.reviewduck.admin.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.repository.Repository;

import com.reviewduck.member.domain.Member;

public interface AdminMemberRepository extends Repository<Member, Long> {

    List<Member> findAll();

    Optional<Member> findById(Long memberId);
}
