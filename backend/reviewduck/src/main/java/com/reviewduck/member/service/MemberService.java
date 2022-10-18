package com.reviewduck.member.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.reviewduck.auth.exception.AuthorizationException;
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

    @Transactional
    public MemberResponse save(Member member) {
        return MemberResponse.from(memberRepository.save(member));
    }

    public MemberResponse findById(Long id) {
        Member member = memberRepository.findById(id)
            .orElseThrow(() -> new AuthorizationException("존재하지 않는 사용자입니다."));
        return MemberResponse.from(member);
    }

    public MemberResponse getBySocialId(String socialId) {
        Member member = memberRepository.findBySocialId(socialId)
            .orElseThrow(() -> new NotFoundException("존재하지 않는 사용자입니다."));
        return MemberResponse.from(member);
    }

    public List<MemberResponse> findAllParticipantsByCode(ReviewForm reviewForm) {
        return memberRepository.findAllParticipantsByReviewFormCode(reviewForm)
            .stream()
            .map(MemberResponse::from)
            .collect(Collectors.toUnmodifiableList());
    }

    @Transactional
    public void updateNickname(Member member, String nickname) {
        member.updateNickname(nickname);
    }
}
