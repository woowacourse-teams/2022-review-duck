package com.reviewduck.member.controller;

import static com.reviewduck.common.util.Logging.*;

import javax.validation.Valid;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Caching;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.reviewduck.auth.support.AuthenticationPrincipal;
import com.reviewduck.member.dto.request.MemberUpdateNicknameRequest;
import com.reviewduck.member.dto.response.MemberDto;
import com.reviewduck.member.dto.response.MemberResponse;
import com.reviewduck.member.service.MemberAggregator;

import io.swagger.v3.oas.annotations.Operation;
import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/api/members")
@AllArgsConstructor
public class MemberController {

    private final MemberAggregator aggregator;

    @Operation(summary = "사용자 정보를 조회한다.")
    @GetMapping("/{socialId}")
    @ResponseStatus(HttpStatus.OK)
    public MemberResponse findMemberInfo(@AuthenticationPrincipal MemberDto member,
        @PathVariable String socialId) {

        info("/api/members/" + socialId, "GET", "");

        return aggregator.findMemberInfo(socialId, member.getId());
    }

    @Operation(summary = "본인의 사용자 정보를 조회한다.")
    @GetMapping("/me")
    @ResponseStatus(HttpStatus.OK)
    public MemberResponse findMyInfo(@AuthenticationPrincipal MemberDto member) {

        info("/api/members/me", "GET", "");

        return aggregator.findMyInfo(member.getId());
    }

    @Operation(summary = "본인의 닉네임을 변경한다.")
    @PutMapping("/me")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Caching(evict = {
        @CacheEvict(value = "memberCacheStore", key = "#member.id"),
        @CacheEvict(value = "memberCacheStore", key = "#member.socialId")
    })
    public void updateNickname(@AuthenticationPrincipal MemberDto member, @Valid @RequestBody
        MemberUpdateNicknameRequest request) {

        info("/api/members/me", "PUT", request.toString());

        aggregator.updateNickname(member.getId(), request.getNickname());
    }
}
