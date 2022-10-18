package com.reviewduck.admin.service;

import java.util.List;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.reviewduck.admin.repository.AdminMemberRepository;
import com.reviewduck.common.exception.NotFoundException;
import com.reviewduck.member.domain.Member;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor(access = AccessLevel.PROTECTED)
@Transactional(readOnly = true)
public class AdminMemberService {

    private AdminMemberRepository memberRepository;

    public List<Member> findAllMembers() {
        return memberRepository.findAll();
    }

    @Cacheable(value = "memberCacheStore", key = "#memberId")
    public Member findMemberById(Long memberId) {
        return memberRepository.findById(memberId)
            .orElseThrow(() -> new NotFoundException("존재하지 않는 사용자입니다."));
    }

    @Transactional
    @Caching(evict = {
        @CacheEvict(value = "memberCacheStore", key = "#member.id"),
        @CacheEvict(value = "memberCacheStore", key = "#member.socialId")
    })
    public void deleteMember(Member member) {
        memberRepository.findBySocialId(member.getSocialId())
                .orElseThrow(() -> new NotFoundException("존재하지 않는 사용자입니다."));
        member.deleteAllInfo();
    }
}
