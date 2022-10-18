package com.reviewduck.member.service;

import java.util.List;
import java.util.Optional;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.reviewduck.auth.exception.AuthorizationException;
import com.reviewduck.common.exception.NotFoundException;
import com.reviewduck.member.domain.Member;
import com.reviewduck.member.repository.MemberRepository;
import com.reviewduck.review.domain.ReviewForm;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
@Transactional(readOnly = true)
public class MemberService {

    private final MemberRepository memberRepository;

    @Transactional
    @Cacheable(value = "memberCacheStore", key = "#member.socialId")
    public Member save(Member member) {
        return memberRepository.save(member);
    }

    @Cacheable(value = "memberCacheStore", key = "#id")
    public Member findById(Long id) {
        return memberRepository.findById(id)
            .orElseThrow(() -> new AuthorizationException("존재하지 않는 사용자입니다."));
    }

    @Cacheable(value = "memberCacheStore", key = "#socialId")
    public Member getBySocialId(String socialId) {
        return findBySocialId(socialId)
            .orElseThrow(() -> new NotFoundException("존재하지 않는 사용자입니다."));
    }

    public Optional<Member> findBySocialId(String socialId) {
        return memberRepository.findBySocialId(socialId);
    }

    @Cacheable(value = "memberCacheStore", key = "#reviewForm.code")
    public List<Member> findAllParticipantsByCode(ReviewForm reviewForm) {
        return memberRepository.findAllParticipantsByReviewFormCode(reviewForm);
    }

    @Transactional
    @Caching(evict = {
        @CacheEvict(value = "memberCacheStore", key = "#member.id"),
        @CacheEvict(value = "memberCacheStore", key = "#member.socialId")
    })
    public void updateNickname(Member member, String nickname) {
        member.updateNickname(nickname);
    }
}
