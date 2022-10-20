package com.reviewduck.review.service;

import java.util.List;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.transaction.annotation.Transactional;

import com.reviewduck.common.annotation.Aggregator;
import com.reviewduck.member.domain.Member;
import com.reviewduck.member.dto.response.MemberDto;
import com.reviewduck.member.service.MemberService;
import com.reviewduck.review.domain.Review;
import com.reviewduck.review.domain.ReviewForm;
import com.reviewduck.review.dto.controller.request.ReviewCreateRequest;
import com.reviewduck.review.dto.controller.request.ReviewFormCreateRequest;
import com.reviewduck.review.dto.controller.request.ReviewFormUpdateRequest;
import com.reviewduck.review.dto.controller.response.MemberReviewFormsResponse;
import com.reviewduck.review.dto.controller.response.ReviewFormCodeResponse;
import com.reviewduck.review.dto.controller.response.ReviewFormResponse;
import com.reviewduck.review.dto.controller.response.ReviewsOfReviewFormResponse;

import lombok.AllArgsConstructor;

@Aggregator
@AllArgsConstructor
public class ReviewFormAggregator {

    private final ReviewFormService reviewFormService;
    private final ReviewService reviewService;
    private final MemberService memberService;

    @Transactional
    public ReviewFormCodeResponse save(long memberId, ReviewFormCreateRequest request) {
        return ReviewFormCodeResponse.from(reviewFormService.save(memberId, request));
    }

    public ReviewFormResponse findByCode(String reviewFormCode, long memberId) {
        ReviewForm reviewForm = reviewFormService.findByCode(reviewFormCode);
        List<Member> members = memberService.findAllParticipantsByCode(reviewForm);
        return ReviewFormResponse.of(reviewForm, reviewForm.isMine(memberId), members);
    }

    public MemberReviewFormsResponse findBySocialId(String socialId, int page, int size, MemberDto member) {
        Page<ReviewForm> reviewForms = reviewFormService.findBySocialId(socialId, page, size);
        return MemberReviewFormsResponse.of(reviewForms, socialId, member);
    }

    public ReviewsOfReviewFormResponse findAllByCode(String reviewFormCode, int page, int size,
        String displayType, long memberId) {
        Page<Review> reviews = reviewService.findAllByCode(reviewFormCode, page, size);
        return ReviewsOfReviewFormResponse.of(memberId, reviews, displayType);
    }

    @Transactional
    public ReviewFormCodeResponse update(long memberId, String reviewFormCode, ReviewFormUpdateRequest request) {
        ReviewForm reviewForm = reviewFormService.update(memberId, reviewFormCode, request);
        return ReviewFormCodeResponse.from(reviewForm);
    }

    @Transactional
    public void delete(long memberId, String reviewFormCode) {
        reviewFormService.deleteByCode(memberId, reviewFormCode);
    }

    /* -- 회고 질문지 관련 메서드 -- */
    @Transactional
    public void createReview(long memberId, String reviewFormCode, ReviewCreateRequest request) {
        reviewService.save(memberId, reviewFormCode, request);
    }
}
