package com.reviewduck.member.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.reviewduck.auth.exception.AuthorizationException;
import com.reviewduck.common.exception.NotFoundException;
import com.reviewduck.member.domain.Member;
import com.reviewduck.member.dto.response.MemberDto;
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

    public MemberDto findById(long id) {
        return MemberDto.from(findMemberById(id));
    }

    public MemberDto getBySocialId(String socialId) {
        Member member = memberRepository.findBySocialId(socialId)
            .orElseThrow(() -> new NotFoundException("존재하지 않는 사용자입니다."));
        return MemberDto.from(member);
    }

    @Transactional
    public void updateNickname(long id, String nickname) {
        findMemberById(id).updateNickname(nickname);
    }

    private Member findMemberById(long id) {
        return memberRepository.findById(id)
            .orElseThrow(() -> new AuthorizationException("존재하지 않는 사용자입니다."));
    }
}
