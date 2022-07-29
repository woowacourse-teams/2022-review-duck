package com.reviewduck.member.controller;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.reviewduck.auth.support.AuthenticationPrincipal;
import com.reviewduck.member.domain.Member;
import com.reviewduck.member.dto.response.MemberResponse;

import io.swagger.v3.oas.annotations.Operation;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/members")
@Slf4j
public class MemberController {

    @Operation(summary = "본인의 사용자 정보를 조회한다.")
    @GetMapping("/me")
    @ResponseStatus(HttpStatus.OK)
    public MemberResponse findMyMemberInfo(@AuthenticationPrincipal Member member) {

        log.info("uri={}, method = {}, request = {}",
            "/api/members/me", "GET", "");

        return MemberResponse.from(member);
    }
}
