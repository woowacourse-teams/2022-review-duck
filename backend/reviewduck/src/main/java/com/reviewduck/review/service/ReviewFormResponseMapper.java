package com.reviewduck.review.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.reviewduck.member.dto.response.MemberDto;
import com.reviewduck.member.repository.MemberRepository;
import com.reviewduck.review.domain.Review;
import com.reviewduck.review.domain.ReviewForm;
import com.reviewduck.review.dto.controller.request.ReviewFormCreateRequest;
import com.reviewduck.review.dto.controller.request.ReviewFormUpdateRequest;
import com.reviewduck.review.dto.controller.response.MemberReviewFormsResponse;
import com.reviewduck.review.dto.controller.response.ReviewFormCodeResponse;
import com.reviewduck.review.dto.controller.response.ReviewFormResponse;
import com.reviewduck.review.dto.controller.response.ReviewsOfReviewFormResponse;

import lombok.AllArgsConstructor;

@Component
@Transactional(readOnly = true)
@AllArgsConstructor
public class ReviewFormResponseMapper {

    private final ReviewFormService reviewFormService;
    private final ReviewService reviewService;

    private final MemberRepository memberRepository;

    @Transactional
    public ReviewFormCodeResponse save(long memberId, ReviewFormCreateRequest request) {
        return ReviewFormCodeResponse.from(reviewFormService.save(memberId, request));
    }

    public ReviewFormResponse findByCode(String reviewFormCode, long memberId) {
        ReviewForm reviewForm = reviewFormService.findByCode(reviewFormCode);
        List<MemberDto> members = findAllParticipantsByCode(reviewForm);
        return ReviewFormResponse.of(reviewForm, reviewForm.isMine(memberId), members);
    }

    private List<MemberDto> findAllParticipantsByCode(ReviewForm reviewForm) {
        return memberRepository.findAllParticipantsByReviewFormCode(reviewForm)
            .stream()
            .map(MemberDto::from)
            .collect(Collectors.toUnmodifiableList());
    }

    public MemberReviewFormsResponse findBySocialId(String socialId, int page, int size, MemberDto member) {
        Page<ReviewForm> reviewForms = reviewFormService.findBySocialId(socialId, page, size);
        return MemberReviewFormsResponse.of(reviewForms, socialId, member);
    }

    public ReviewsOfReviewFormResponse findAllByCode(String reviewFormCode, int page, int size,
        String displayType, MemberDto member) {
        Page<Review> reviews = reviewService.findAllByCode(reviewFormCode, page, size);
        return ReviewsOfReviewFormResponse.of(member, reviews, displayType);
    }

    @Transactional
    public ReviewFormCodeResponse update(long memberId, String reviewFormCode, ReviewFormUpdateRequest request) {
        ReviewForm reviewForm = reviewFormService.update(memberId, reviewFormCode, request);
        return ReviewFormCodeResponse.from(reviewForm);
    }
}
