package com.reviewduck.member.controller;

import static com.reviewduck.common.util.Logging.*;

import javax.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.reviewduck.auth.support.AuthenticationPrincipal;
import com.reviewduck.member.domain.Member;
import com.reviewduck.member.dto.request.MemberUpdateNicknameRequest;
import com.reviewduck.member.dto.response.MemberResponse;
import com.reviewduck.member.service.MemberService;

import io.swagger.v3.oas.annotations.Operation;
import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/api/members")
@AllArgsConstructor
public class MemberController {

    private final MemberService memberService;

    @Operation(summary = "본인의 사용자 정보를 조회한다.")
    @GetMapping("/me")
    @ResponseStatus(HttpStatus.OK)
    public MemberResponse findMyMemberInfo(@AuthenticationPrincipal Member member) {

        info("/api/members/me", "GET", "");

        return MemberResponse.from(member);
    }

    @Operation(summary = "본인의 닉네임을 변경한다.")
    @PutMapping("/me")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void updateMyNickname(@AuthenticationPrincipal Member member, @Valid @RequestBody
        MemberUpdateNicknameRequest request) {

        info("/api/members/me", "PUT", request.toString());

        memberService.updateNickname(member, request.getNickname());
    }
}
