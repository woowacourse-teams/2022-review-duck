package com.reviewduck.review.dto.controller.response;

import com.reviewduck.review.domain.ReviewComment;
import org.springframework.data.domain.Page;

public class ReviewCommentsResponse {
    public static ReviewCommentsResponse from(Page<ReviewComment> reviewComments) {
        return null;
    }
}
