package com.reviewduck.review.service;

import org.springframework.data.domain.Page;
import org.springframework.transaction.annotation.Transactional;

import com.reviewduck.common.annotation.Aggregator;
import com.reviewduck.member.domain.Member;
import com.reviewduck.member.service.MemberService;
import com.reviewduck.review.domain.Review;
import com.reviewduck.review.dto.controller.request.ReviewUpdateRequest;
import com.reviewduck.review.dto.controller.response.ReviewEditResponse;
import com.reviewduck.review.dto.controller.response.ReviewEditResponseBuilder;
import com.reviewduck.review.dto.controller.response.ReviewLikesResponse;
import com.reviewduck.review.dto.controller.response.ReviewsResponse;
import com.reviewduck.review.dto.controller.response.TimelineReviewsResponse;

import lombok.AllArgsConstructor;

@Aggregator
@AllArgsConstructor
public class ReviewAggregator {

    private final ReviewService reviewService;
    private final MemberService memberService;

    public ReviewEditResponse findEditedById(long reviewId) {
        Review review = reviewService.findById(reviewId);
        return ReviewEditResponseBuilder.createResponseFrom(review);
    }

    public ReviewsResponse findAllBySocialId(String socialId, long memberId, int page,
        int size) {
        Member owner = memberService.findBySocialId(socialId);

        Page<Review> reviews = reviewService.findAllBySocialId(owner, memberId, page, size);
        return ReviewsResponse.of(reviews, owner.isSameId(memberId));
    }

    public TimelineReviewsResponse findAllPublic(int page, int size, String sort,
        long memberId) {
        Page<Review> reviews = reviewService.findAllPublic(page, size, sort);
        return TimelineReviewsResponse.of(reviews, memberId);
    }

    @Transactional
    public ReviewLikesResponse likes(long reviewId, int likesCount) {
        int likes = reviewService.increaseLikes(reviewId, likesCount);
        return new ReviewLikesResponse(likes);
    }

    @Transactional
    public void update(long memberId, long reviewId, ReviewUpdateRequest request) {
        reviewService.update(memberId, reviewId, request);
    }

    @Transactional
    public void delete(long memberId, long reviewId) {
        reviewService.delete(memberId, reviewId);
    }
}
