package com.reviewduck.admin.controller;

import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.reviewduck.admin.dto.AdminMemberDto;
import com.reviewduck.admin.dto.response.AdminMemberResponse;
import com.reviewduck.admin.dto.response.AdminMembersResponse;
import com.reviewduck.admin.service.AdminMemberService;
import com.reviewduck.auth.exception.AuthorizationException;
import com.reviewduck.auth.support.AdminAuthenticationPrincipal;
import com.reviewduck.common.util.Logging;

import io.swagger.v3.oas.annotations.Operation;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/admin/members")
@AllArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class AdminMemberController {

    private final AdminMemberService adminMemberService;

    @Operation(summary = "가입한 사용자를 전원 조회한다")
    @GetMapping()
    @ResponseStatus(HttpStatus.OK)
    public AdminMembersResponse findAllMembers(@AdminAuthenticationPrincipal AdminMemberDto member) {

        Logging.info("api/admin/members", "GET", "");

        return adminMemberService.findAllMembers();
    }

    @Operation(summary = "단일 사용자를 조회한다")
    @GetMapping("/{memberId}")
    @ResponseStatus(HttpStatus.OK)
    public AdminMemberResponse findMember(@AdminAuthenticationPrincipal AdminMemberDto member,
        @PathVariable long memberId) {

        Logging.info("api/admin/members" + memberId, "GET", "");

        return adminMemberService.findMember(memberId);
    }

    @Operation(summary = "사용자를 탈퇴시킨다")
    @DeleteMapping("/{memberId}")
    @ResponseStatus(HttpStatus.OK)
    @Transactional
    public void deleteMember(@AdminAuthenticationPrincipal AdminMemberDto member, @PathVariable long memberId) {

        Logging.info("api/admin/members/" + memberId, "DELETE", "");

        adminMemberService.deleteMember(memberId);
    }
}
