package com.reviewduck.review.dto.controller.response;

import com.reviewduck.member.dto.response.MemberResponse;
import com.reviewduck.review.domain.ReviewForm;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class ReviewFormSummaryResponse {

    private String title;
    private String code;
    private CreatorResponse creator;

    public static ReviewFormSummaryResponse from(ReviewForm reviewForm) {
        return new ReviewFormSummaryResponse(
            reviewForm.getTitle(),
            reviewForm.getCode(),
            // todo
            CreatorResponse.from(MemberResponse.from(reviewForm.getMember()))
        );
    }
}
