package com.reviewduck.member.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
    public Member save(Member member) {
        return memberRepository.save(member);
    }

    public Member findById(long id) {
        return getById(id)
            .orElseThrow(() -> new NotFoundException("존재하지 않는 사용자입니다."));
    }

    public Optional<Member> getById(long id) {
        return memberRepository.findById(id);
    }

    public Member findBySocialId(String socialId) {
        return memberRepository.findBySocialId(socialId)
            .orElseThrow(() -> new NotFoundException("존재하지 않는 사용자입니다."));
    }

    public List<Member> findAllParticipantsByCode(ReviewForm reviewForm) {
        return memberRepository.findAllParticipantsByReviewFormCode(reviewForm);
    }

    @Transactional
    public void updateNickname(long id, String nickname) {
        findById(id).updateNickname(nickname);
    }
}
