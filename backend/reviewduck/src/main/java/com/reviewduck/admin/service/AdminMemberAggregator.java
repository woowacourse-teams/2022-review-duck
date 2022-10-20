package com.reviewduck.admin.service;

import java.util.List;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.transaction.annotation.Transactional;

import com.reviewduck.admin.dto.AdminMemberDto;
import com.reviewduck.admin.dto.response.AdminMemberResponse;
import com.reviewduck.admin.dto.response.AdminMembersResponse;
import com.reviewduck.common.annotation.Aggregator;
import com.reviewduck.member.domain.Member;

import lombok.AllArgsConstructor;

@Aggregator
@AllArgsConstructor
public class AdminMemberAggregator {

    private final AdminMemberService adminMemberService;

    public AdminMembersResponse findAllMembers() {
        List<Member> members = adminMemberService.findAllMembers();
        return AdminMembersResponse.from(members);
    }

    @Cacheable(value = "memberCacheStore", key = "#memberId")
    public AdminMemberResponse findMember(long memberId) {
        Member foundMember = adminMemberService.findMemberById(memberId);
        return AdminMemberResponse.from(foundMember);
    }

    @Transactional
    @Caching(evict = {
        @CacheEvict(value = "memberCacheStore", key = "#member.id"),
        @CacheEvict(value = "memberCacheStore", key = "#member.socialId")
    })
    public void deleteMember(AdminMemberDto member) {
        adminMemberService.deleteMemberById(member.getId());
    }
}
