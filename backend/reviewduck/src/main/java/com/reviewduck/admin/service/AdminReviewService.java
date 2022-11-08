package com.reviewduck.admin.service;

import java.util.List;

import org.springframework.transaction.annotation.Transactional;

import com.reviewduck.admin.dto.response.AdminReviewResponse;
import com.reviewduck.admin.dto.response.AdminReviewsResponse;
import com.reviewduck.admin.repository.AdminReviewRepository;
import com.reviewduck.common.annotation.Aggregator;
import com.reviewduck.common.exception.NotFoundException;
import com.reviewduck.member.domain.Member;
import com.reviewduck.review.domain.Review;
import com.reviewduck.review.domain.ReviewForm;

import lombok.AllArgsConstructor;

@Aggregator
@AllArgsConstructor
@Transactional(readOnly = true)
public class AdminReviewService {

    private final AdminMemberService adminMemberService;
    private final AdminReviewRepository adminReviewRepository;

    public AdminReviewsResponse findAllReviews() {
        List<Review> reviews = adminReviewRepository.findAll();
        return AdminReviewsResponse.from(reviews);
    }

    public AdminReviewResponse findReview(long reviewId) {
        Review review = findById(reviewId);
        return AdminReviewResponse.from(review);
    }

    public AdminReviewsResponse findMemberReviews(long memberId) {
        Member member = adminMemberService.findMemberById(memberId);

        List<Review> reviews = adminReviewRepository.findAllByMember(member);
        return AdminReviewsResponse.from(reviews);
    }

    @Transactional
    public void deleteReview(long reviewId) {
        Review review = findById(reviewId);
        adminReviewRepository.delete(review);
    }

    public List<Review> findAllByReviewForm(ReviewForm reviewForm) {
        return adminReviewRepository.findAllByReviewForm(reviewForm);
    }

    private Review findById(long reviewId) {
        return adminReviewRepository.findById(reviewId)
            .orElseThrow(() -> new NotFoundException("존재하지 않는 회고입니다."));
    }
}
