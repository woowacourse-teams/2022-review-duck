package com.reviewduck.review.dto.controller.response;

import com.reviewduck.review.domain.ReviewComment;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class ReviewCommentResponse {

    private String content;

    public static ReviewCommentResponse from(ReviewComment reviewComment) {
        return new ReviewCommentResponse(
                reviewComment.getContent()
        );
    }
}
