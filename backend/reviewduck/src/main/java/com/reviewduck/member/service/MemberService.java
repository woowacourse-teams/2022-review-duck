package com.reviewduck.member.service;

import java.util.List;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.reviewduck.common.exception.NotFoundException;
import com.reviewduck.member.domain.Member;
import com.reviewduck.member.dto.response.MemberResponse;
import com.reviewduck.member.repository.MemberRepository;
import com.reviewduck.review.domain.ReviewForm;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
@Transactional(readOnly = true)
public class MemberService {

    private final MemberRepository memberRepository;

    @Cacheable(value = "memberCacheStore", key = "#socialId")
    public MemberResponse findMemberInfo(String socialId, long myMemberId) {
        Member member = findBySocialId(socialId);
        return MemberResponse.of(member, myMemberId);
    }

    @Cacheable(value = "memberCacheStore", key = "#memberId")
    public MemberResponse findMyInfo(long memberId) {
        Member member = findById(memberId);
        return MemberResponse.from(member);
    }

    @Transactional
    @CacheEvict(value = "memberCacheStore", key = "#memberId")
    public void updateNickname(long memberId, String nickname) {
        Member member = findById(memberId);
        member.updateNickname(nickname);
    }

    public Member findById(long id) {
        return memberRepository.findById(id)
            .orElseThrow(() -> new NotFoundException("존재하지 않는 사용자입니다."));
    }

    private Member findBySocialId(String socialId) {
        return memberRepository.findBySocialId(socialId)
            .orElseThrow(() -> new NotFoundException("존재하지 않는 사용자입니다."));
    }
}
