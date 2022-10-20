package com.reviewduck.admin.service;

import java.util.List;

import com.reviewduck.admin.dto.response.AdminReviewFormResponse;
import com.reviewduck.admin.dto.response.AdminReviewFormsResponse;
import com.reviewduck.admin.dto.response.AdminReviewResponse;
import com.reviewduck.admin.dto.response.AdminReviewsResponse;
import com.reviewduck.common.annotation.Aggregator;
import com.reviewduck.review.domain.Review;
import com.reviewduck.review.domain.ReviewForm;

import lombok.AllArgsConstructor;

@Aggregator
@AllArgsConstructor
public class AdminReviewAggregator {

    private final AdminReviewService adminReviewService;
    private final AdminReviewFormService adminReviewFormService;

    public AdminReviewFormsResponse findAllReviewForms() {
        List<ReviewForm> reviewForms = adminReviewFormService.findAllReviewForms();
        return AdminReviewFormsResponse.from(reviewForms);
    }

    public AdminReviewFormsResponse findMemberReviewForms(long memberId) {
        List<ReviewForm> reviewForms = adminReviewFormService.findByMemberId(memberId);
        return AdminReviewFormsResponse.from(reviewForms);
    }

    public AdminReviewFormResponse findReviewForm(String reviewFormCode) {
        ReviewForm reviewForm = adminReviewFormService.findByCode(reviewFormCode);
        List<Review> reviews = adminReviewService.findAllByReviewForm(reviewForm);

        return AdminReviewFormResponse.of(reviewForm, reviews);
    }

    public void deleteReviewForm(long reviewFormId) {
        adminReviewFormService.deleteReviewFormById(reviewFormId);
    }

    public AdminReviewsResponse findAllReviews() {
        List<Review> reviews = adminReviewService.findAllReviews();
        return AdminReviewsResponse.from(reviews);
    }

    public AdminReviewResponse findReview(long reviewId) {
        Review review = adminReviewService.findById(reviewId);
        return AdminReviewResponse.from(review);
    }

    public AdminReviewsResponse findMemberReviews(long memberId) {
        List<Review> reviews = adminReviewService.findByMemberId(memberId);
        return AdminReviewsResponse.from(reviews);
    }

    public void deleteReview(long reviewId) {
        adminReviewService.deleteReviewById(reviewId);
    }
}
