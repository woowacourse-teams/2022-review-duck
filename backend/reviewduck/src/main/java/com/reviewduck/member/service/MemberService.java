package com.reviewduck.member.service;

import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.reviewduck.auth.exception.AuthorizationException;
import com.reviewduck.member.domain.Member;
import com.reviewduck.member.repository.MemberRepository;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
@Transactional(readOnly = true)
public class MemberService {

    private final MemberRepository memberRepository;

    @Transactional
    public Member save(Member member) {
        return memberRepository.save(member);
    }

    public Member findById(Long id) {
        return memberRepository.findById(id)
            .orElseThrow(() -> new AuthorizationException("존재하지 않는 사용자입니다."));
    }

    public Optional<Member> findBySocialId(String socialId) {
        return memberRepository.findBySocialId(socialId);
    }

    @Transactional
    public void updateNickname(Member member, String nickname) {
        member.updateNickname(nickname);
    }
}
