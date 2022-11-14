package com.reviewduck.review.service;

import org.springframework.data.domain.Page;
import org.springframework.transaction.annotation.Transactional;

import com.reviewduck.common.annotation.Aggregator;
import com.reviewduck.member.dto.MemberDto;
import com.reviewduck.review.domain.Review;
import com.reviewduck.review.domain.ReviewForm;
import com.reviewduck.review.dto.controller.request.ReviewCreateRequest;
import com.reviewduck.review.dto.controller.request.ReviewFormUpdateRequest;
import com.reviewduck.review.dto.controller.response.MemberReviewFormsResponse;
import com.reviewduck.review.dto.controller.response.ReviewFormCodeResponse;
import com.reviewduck.review.dto.controller.response.ReviewsOfReviewFormResponse;

import lombok.AllArgsConstructor;

@Aggregator
@AllArgsConstructor
public class ReviewFormAggregator {

    private final ReviewService reviewService;

    public ReviewsOfReviewFormResponse findAllByCode(String reviewFormCode, int page, int size,
        String displayType, long memberId) {
        Page<Review> reviews = reviewService.findAllByCode(reviewFormCode, page, size);
        return ReviewsOfReviewFormResponse.of(memberId, reviews, displayType);
    }

    /* -- 회고 답변 관련 메서드 -- */
    @Transactional
    public void createReview(long memberId, String reviewFormCode, ReviewCreateRequest request) {
        reviewService.save(memberId, reviewFormCode, request);
    }
}
