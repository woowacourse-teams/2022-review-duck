package com.reviewduck.admin.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.reviewduck.admin.dto.response.AdminMemberResponse;
import com.reviewduck.admin.dto.response.AdminMembersResponse;
import com.reviewduck.admin.service.AdminMemberService;
import com.reviewduck.auth.exception.AuthorizationException;
import com.reviewduck.auth.support.AuthenticationPrincipal;
import com.reviewduck.common.util.Logging;
import com.reviewduck.member.domain.Member;

import io.swagger.v3.oas.annotations.Operation;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/admin/members")
@AllArgsConstructor
@Slf4j
public class AdminMemberController {

    private final AdminMemberService adminMemberService;

    @Operation(summary = "가입한 사용자를 전원 조회한다")
    @GetMapping()
    @ResponseStatus(HttpStatus.OK)
    public AdminMembersResponse findAllMembers(@AuthenticationPrincipal Member member) {

        Logging.info("api/admin/members", "GET", "");

        validateAdmin(member);
        List<Member> members = adminMemberService.findAllMembers();

        return AdminMembersResponse.from(members);
    }

    @Operation(summary = "단일 사용자를 조회한다")
    @GetMapping("/{memberId}")
    @ResponseStatus(HttpStatus.OK)
    public AdminMemberResponse findMember(@AuthenticationPrincipal Member member, @PathVariable long memberId) {

        Logging.info("api/admin/members" + memberId, "GET", "");

        validateAdmin(member);
        Member foundMember = adminMemberService.findMemberById(memberId);

        return AdminMemberResponse.from(foundMember);
    }

    @Operation(summary = "사용자를 탈퇴시킨다")
    @DeleteMapping("/{memberId}")
    @ResponseStatus(HttpStatus.OK)
    public void deleteMember(@AuthenticationPrincipal Member member, @PathVariable long memberId) {

        Logging.info("api/admin/members/" + memberId, "DELETE", "");

        validateAdmin(member);
        adminMemberService.deleteMemberById(memberId);
    }

    private void validateAdmin(Member member) {
        if (!member.isAdmin()) {
            throw new AuthorizationException("어드민 권한이 없습니다.");
        }
    }
}
