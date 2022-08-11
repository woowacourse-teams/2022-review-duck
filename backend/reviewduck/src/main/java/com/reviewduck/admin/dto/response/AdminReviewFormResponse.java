package com.reviewduck.admin.dto.response;

import java.time.LocalDateTime;

import com.reviewduck.review.domain.ReviewForm;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class AdminReviewFormResponse {

    private Long id;
    private Long memberId;
    private String memberProfileUrl;
    private String memberNickname;
    private String code;
    private String reviewTitle;
    private boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static AdminReviewFormResponse from(ReviewForm reviewForm) {
        return new AdminReviewFormResponse(reviewForm.getId(), reviewForm.getMember().getId(),
            reviewForm.getMember().getProfileUrl(), reviewForm.getMember().getNickname(), reviewForm.getCode(),
            reviewForm.getTitle(), reviewForm.isActive(), reviewForm.getCreatedAt(), reviewForm.getUpdatedAt());
    }
}
