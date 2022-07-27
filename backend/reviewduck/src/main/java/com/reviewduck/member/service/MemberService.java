package com.reviewduck.member.service;

import javax.transaction.Transactional;

import org.springframework.stereotype.Service;

import com.reviewduck.auth.exception.AuthorizationException;
import com.reviewduck.common.exception.NotFoundException;
import com.reviewduck.member.domain.Member;
import com.reviewduck.member.repository.MemberRepository;

@Service
@Transactional
public class MemberService {

    private final MemberRepository memberRepository;

    public MemberService(MemberRepository memberRepository) {
        this.memberRepository = memberRepository;
    }

    public Member save(Member member) {
        return memberRepository.save(member);
    }

    public Member findById(Long id) {
        return memberRepository.findById(id)
            .orElseThrow(() -> new AuthorizationException("존재하지 않는 사용자입니다."));
    }

    public boolean existMember(String socialId) {
        return memberRepository.existsBySocialId(socialId);
    }

    public Member findBySocialId(String socialId) {
        return memberRepository.findBySocialId(socialId);
    }
}
