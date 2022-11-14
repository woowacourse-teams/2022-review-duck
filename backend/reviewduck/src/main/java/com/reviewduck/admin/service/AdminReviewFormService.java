package com.reviewduck.admin.service;

import java.util.List;

import org.springframework.transaction.annotation.Transactional;

import com.reviewduck.admin.dto.response.AdminReviewFormResponse;
import com.reviewduck.admin.dto.response.AdminReviewFormsResponse;
import com.reviewduck.admin.repository.AdminReviewFormRepository;
import com.reviewduck.common.annotation.Aggregator;
import com.reviewduck.common.exception.NotFoundException;
import com.reviewduck.member.domain.Member;
import com.reviewduck.review.domain.Review;
import com.reviewduck.review.domain.ReviewForm;

import lombok.AllArgsConstructor;

@Aggregator
@AllArgsConstructor
@Transactional(readOnly = true)
public class AdminReviewFormService {

    private final AdminMemberService adminMemberService;
    private final AdminReviewService adminReviewService;
    private final AdminReviewFormRepository adminReviewFormRepository;

    public AdminReviewFormsResponse findAllReviewForms() {
        List<ReviewForm> reviewForms = adminReviewFormRepository.findAll();
        return AdminReviewFormsResponse.from(reviewForms);
    }

    public AdminReviewFormsResponse findMemberReviewForms(long memberId) {
        Member member = adminMemberService.findMemberById(memberId);

        List<ReviewForm> reviewForms = adminReviewFormRepository.findAllByMember(member);
        return AdminReviewFormsResponse.from(reviewForms);
    }

    public AdminReviewFormResponse findReviewForm(String reviewFormCode) {
        ReviewForm reviewForm = findByCode(reviewFormCode);
        List<Review> reviews = adminReviewService.findAllByReviewForm(reviewForm);

        return AdminReviewFormResponse.of(reviewForm, reviews);
    }

    @Transactional
    public void deleteReviewForm(long reviewFormId) {
        ReviewForm reviewForm = findById(reviewFormId);
        adminReviewFormRepository.delete(reviewForm);
    }

    ReviewForm findByCode(String reviewFormCode) {
        return adminReviewFormRepository.findByCode(reviewFormCode);
    }

    private ReviewForm findById(Long reviewFormId) {
        return adminReviewFormRepository.findById(reviewFormId)
            .orElseThrow(() -> new NotFoundException("존재하지 않는 회고 폼입니다."));
    }
}
