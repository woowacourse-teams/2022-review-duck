package com.reviewduck.admin.service;

import java.util.List;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.reviewduck.admin.dto.AdminMemberDto;
import com.reviewduck.admin.dto.response.AdminMemberResponse;
import com.reviewduck.admin.dto.response.AdminMembersResponse;
import com.reviewduck.member.domain.Member;

import lombok.AllArgsConstructor;

@Component
@Transactional(readOnly = true)
@AllArgsConstructor
public class AdminMemberAggregator {
    private final AdminMemberService adminMemberService;

    public AdminMembersResponse findAllMembers() {
        List<Member> members = adminMemberService.findAllMembers();
        return AdminMembersResponse.from(members);
    }

    @Cacheable(value = "memberCacheStore", key = "#memberId")
    public AdminMemberResponse findMemberById(Long memberId) {
        Member foundMember = adminMemberService.findMemberById(memberId);
        return AdminMemberResponse.from(foundMember);
    }

    @Transactional
    @Caching(evict = {
        @CacheEvict(value = "memberCacheStore", key = "#member.id"),
        @CacheEvict(value = "memberCacheStore", key = "#member.socialId")
    })
    public void deleteMemberById(AdminMemberDto member) {
        adminMemberService.deleteMemberById(member.getId());
    }
}
