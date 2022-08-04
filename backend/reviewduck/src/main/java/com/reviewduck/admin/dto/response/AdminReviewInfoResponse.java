package com.reviewduck.admin.dto.response;

import java.time.LocalDateTime;

import com.reviewduck.review.domain.Review;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class AdminReviewInfoResponse {
    private Long id;
    private Long memberId;
    private String memberProfileUrl;
    private String memberNickname;
    private String reviewFormCode;
    private String reviewFormTitle;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static AdminReviewInfoResponse from(Review review) {
        return new AdminReviewInfoResponse(review.getId(), review.getMember().getId(),
            review.getMember().getProfileUrl(), review.getMember().getNickname(), review.getReviewForm().getCode(),
            review.getReviewForm().getReviewTitle(), review.getCreatedAt(), review.getUpdatedAt());
    }
}
