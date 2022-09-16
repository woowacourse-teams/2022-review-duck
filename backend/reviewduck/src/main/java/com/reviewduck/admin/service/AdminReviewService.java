package com.reviewduck.admin.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.reviewduck.admin.repository.AdminReviewRepository;
import com.reviewduck.common.exception.NotFoundException;
import com.reviewduck.member.domain.Member;
import com.reviewduck.review.domain.Review;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor(access = AccessLevel.PROTECTED)
@Transactional(readOnly = true)
public class AdminReviewService {

    private AdminMemberService adminMemberService;
    private AdminReviewRepository reviewRepository;

    public List<Review> findAllReviews() {
        return reviewRepository.findAll();
    }

    public List<Review> findByMemberId(Long memberId) {
        Member member = adminMemberService.findMemberById(memberId);
        return reviewRepository.findAllByMember(member);
    }

    @Transactional
    public void deleteReviewById(Long reviewId) {
        reviewRepository.findById(reviewId)
            .orElseThrow(() -> new NotFoundException("존재하지 않는 회고입니다."));

        reviewRepository.deleteById(reviewId);
    }
}
