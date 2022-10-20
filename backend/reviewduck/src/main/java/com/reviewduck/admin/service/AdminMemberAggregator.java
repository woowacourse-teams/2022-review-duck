package com.reviewduck.admin.service;

import java.util.List;

import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

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

    public AdminMemberResponse findMemberById(Long memberId) {
        Member foundMember = adminMemberService.findMemberById(memberId);
        return AdminMemberResponse.from(foundMember);
    }

    public void deleteMemberById(Long memberId) {
        adminMemberService.deleteMemberById(memberId);
    }
}
