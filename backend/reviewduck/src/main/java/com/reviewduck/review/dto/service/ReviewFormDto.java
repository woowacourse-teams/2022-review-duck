package com.reviewduck.review.dto.service;

import java.time.LocalDateTime;
import java.util.List;

import com.reviewduck.member.domain.Member;
import com.reviewduck.review.domain.ReviewForm;
import com.reviewduck.review.domain.ReviewFormQuestion;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class ReviewFormDto {

    private final Long id;
    private final Member member;
    private final String code;
    private final String title;
    private final boolean isActive;
    private final List<ReviewFormQuestion> questions;
    private final LocalDateTime createdAt;
    private final LocalDateTime updatedAt;

    public static ReviewFormDto from(ReviewForm reviewForm) {
        return new ReviewFormDto(reviewForm.getId(), reviewForm.getMember(),
            reviewForm.getCode(), reviewForm.getTitle(), reviewForm.isActive(), reviewForm.getQuestions(),
            reviewForm.getCreatedAt(), reviewForm.getUpdatedAt());
    }
}
