package com.reviewduck.admin.service;

import java.util.List;

import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.reviewduck.admin.dto.response.AdminReviewFormResponse;
import com.reviewduck.admin.dto.response.AdminReviewFormsResponse;
import com.reviewduck.admin.dto.response.AdminReviewResponse;
import com.reviewduck.admin.dto.response.AdminReviewsResponse;
import com.reviewduck.review.domain.Review;
import com.reviewduck.review.domain.ReviewForm;

import lombok.AllArgsConstructor;

@Component
@Transactional(readOnly = true)
@AllArgsConstructor
public class AdminReviewAggregator {

    private final AdminReviewService adminReviewService;
    private final AdminReviewFormService adminReviewFormService;

    public AdminReviewFormsResponse findAllReviewForms() {
        List<ReviewForm> reviewForms = adminReviewFormService.findAllReviewForms();
        return AdminReviewFormsResponse.from(reviewForms);
    }

    public AdminReviewFormsResponse findReviewFormsByMemberId(Long memberId) {
        List<ReviewForm> reviewForms = adminReviewFormService.findByMemberId(memberId);
        return AdminReviewFormsResponse.from(reviewForms);
    }

    public AdminReviewFormResponse findReviewFormByCode(String reviewFormCode) {
        ReviewForm reviewForm = adminReviewFormService.findByCode(reviewFormCode);
        List<Review> reviews = adminReviewService.findAllByReviewForm(reviewForm);

        return AdminReviewFormResponse.of(reviewForm, reviews);
    }

    public void deleteReviewFormById(Long reviewFormId) {
        adminReviewFormService.deleteReviewFormById(reviewFormId);
    }

    public AdminReviewsResponse findAllReviews() {
        List<Review> reviews = adminReviewService.findAllReviews();
        return AdminReviewsResponse.from(reviews);
    }

    public AdminReviewResponse findReviewByReviewId(Long reviewId) {
        Review review = adminReviewService.findById(reviewId);
        return AdminReviewResponse.from(review);
    }

    public AdminReviewsResponse findAllReviewsByMemberId(Long memberId) {
        List<Review> reviews = adminReviewService.findByMemberId(memberId);
        return AdminReviewsResponse.from(reviews);
    }

    public void deleteReviewById(Long reviewId) {
        adminReviewService.deleteReviewById(reviewId);
    }
}
