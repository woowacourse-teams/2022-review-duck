package com.reviewduck.admin.service;

import java.util.List;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.reviewduck.admin.dto.response.AdminMemberResponse;
import com.reviewduck.admin.dto.response.AdminMembersResponse;
import com.reviewduck.admin.repository.AdminMemberRepository;
import com.reviewduck.common.exception.NotFoundException;
import com.reviewduck.member.domain.Member;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
@Transactional(readOnly = true)
public class AdminMemberService {

    private final AdminMemberRepository adminMemberRepository;

    public AdminMembersResponse findAllMembers() {
        List<Member> members = adminMemberRepository.findAll();
        return AdminMembersResponse.from(members);
    }

    @Cacheable(value = "memberCacheStore", key = "#memberId")
    public AdminMemberResponse findMember(long memberId) {
        Member foundMember = findMemberById(memberId);
        return AdminMemberResponse.from(foundMember);
    }

    @Transactional
    @CacheEvict(value = "memberCacheStore", allEntries = true)
    public void deleteMember(Long memberId) {
        Member targetMember = findMemberById(memberId);
        targetMember.deleteAllInfo();
    }

    public Member findMemberById(long memberId) {
        return adminMemberRepository.findById(memberId)
            .orElseThrow(() -> new NotFoundException("존재하지 않는 사용자입니다."));
    }
}
