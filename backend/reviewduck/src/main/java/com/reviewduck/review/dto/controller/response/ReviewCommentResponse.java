package com.reviewduck.review.dto.controller.response;

import com.reviewduck.review.domain.ReviewComment;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class ReviewCommentResponse {

    private String content;
    private boolean isMine;
    private LocalDateTime updatedAt;

    private CreatorResponse creator;
    public static ReviewCommentResponse of(long memberId, ReviewComment reviewComment) {
        return new ReviewCommentResponse(
                reviewComment.getContent(),
                reviewComment.isCommenter(memberId),
                reviewComment.getUpdatedAt(),
                CreatorResponse.from(reviewComment.getMember())
        );
    }
}
