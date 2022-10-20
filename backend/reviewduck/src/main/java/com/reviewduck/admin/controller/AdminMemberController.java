package com.reviewduck.admin.controller;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.reviewduck.admin.dto.AdminMemberDto;
import com.reviewduck.admin.dto.response.AdminMemberResponse;
import com.reviewduck.admin.dto.response.AdminMembersResponse;
import com.reviewduck.admin.service.AdminMemberAggregator;
import com.reviewduck.auth.exception.AuthorizationException;
import com.reviewduck.auth.support.AdminAuthenticationPrincipal;
import com.reviewduck.common.util.Logging;

import io.swagger.v3.oas.annotations.Operation;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/admin/members")
@AllArgsConstructor
@Slf4j
public class AdminMemberController {

    private final AdminMemberAggregator adminMemberAggregator;

    @Operation(summary = "가입한 사용자를 전원 조회한다")
    @GetMapping()
    @ResponseStatus(HttpStatus.OK)
    public AdminMembersResponse findAllMembers(@AdminAuthenticationPrincipal AdminMemberDto member) {

        Logging.info("api/admin/members", "GET", "");

        validateAdmin(member);
        return adminMemberAggregator.findAllMembers();
    }

    @Operation(summary = "단일 사용자를 조회한다")
    @GetMapping("/{memberId}")
    @ResponseStatus(HttpStatus.OK)
    public AdminMemberResponse findMember(@AdminAuthenticationPrincipal AdminMemberDto member,
        @PathVariable Long memberId) {

        Logging.info("api/admin/members" + memberId, "GET", "");

        validateAdmin(member);
        return adminMemberAggregator.findMemberById(memberId);
    }

    @Operation(summary = "사용자를 탈퇴시킨다")
    @DeleteMapping("/{memberId}")
    @ResponseStatus(HttpStatus.OK)
    public void deleteMember(@AdminAuthenticationPrincipal AdminMemberDto member, @PathVariable Long memberId) {

        Logging.info("api/admin/members/" + memberId, "DELETE", "");

        validateAdmin(member);
        adminMemberAggregator.deleteMemberById(member);
    }

    private void validateAdmin(AdminMemberDto member) {
        if (!member.getIsAdmin()) {
            throw new AuthorizationException("어드민 권한이 없습니다.");
        }
    }
}
