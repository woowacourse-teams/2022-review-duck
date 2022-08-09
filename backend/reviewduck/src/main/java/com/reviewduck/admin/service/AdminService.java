package com.reviewduck.admin.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.reviewduck.common.exception.NotFoundException;
import com.reviewduck.member.domain.Member;
import com.reviewduck.member.repository.MemberRepository;
import com.reviewduck.review.domain.Review;
import com.reviewduck.review.domain.ReviewForm;
import com.reviewduck.review.repository.ReviewFormRepository;
import com.reviewduck.review.repository.ReviewRepository;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
@Transactional(readOnly = true)
public class AdminService {

    private MemberRepository memberRepository;
    private ReviewFormRepository reviewFormRepository;
    private ReviewRepository reviewRepository;

    public List<Member> findAllMembers() {
        return memberRepository.findAll();
    }

    @Transactional
    public void deleteMemberById(Long memberId) {
        Member member = memberRepository.findById(memberId)
            .orElseThrow(() -> new NotFoundException("존재하지 않는 사용자입니다."));

        member.deleteAllInfo();
    }

    public List<ReviewForm> findAllReviewForms() {
        return reviewFormRepository.findAll();
    }

    @Transactional
    public void deleteReviewFormById(Long reviewFormId) {
        reviewFormRepository.delete(reviewFormId);
    }

    public List<Review> findAllReviews() {
        return reviewRepository.findAll();
    }

    @Transactional
    public void deleteReviewById(Long reviewId) {
        reviewRepository.deleteById(reviewId);
    }

}
