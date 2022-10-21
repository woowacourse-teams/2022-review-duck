package com.reviewduck.member.service;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.transaction.annotation.Transactional;

import com.reviewduck.common.annotation.Aggregator;
import com.reviewduck.member.domain.Member;
import com.reviewduck.member.dto.response.MemberResponse;

import lombok.AllArgsConstructor;

@Aggregator
@AllArgsConstructor
public class MemberAggregator {

    private final MemberService memberService;

    @Cacheable(value = "memberCacheStore", key = "#socialId")
    public MemberResponse findMemberInfo(String socialId, long myMemberId) {
        Member member = memberService.findBySocialId(socialId);
        return MemberResponse.of(member, myMemberId);
    }

    @Cacheable(value = "memberCacheStore", key = "#memberId")
    public MemberResponse findMyInfo(long memberId) {
        Member member = memberService.findById(memberId);
        return MemberResponse.from(member);
    }

    @Transactional
    @CacheEvict(value = "memberCacheStore", key = "#memberId")
    public void updateNickname(long memberId, String nickname) {
        memberService.updateNickname(memberId, nickname);
    }
}
