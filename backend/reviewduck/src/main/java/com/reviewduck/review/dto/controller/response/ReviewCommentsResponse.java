package com.reviewduck.review.dto.controller.response;

import com.reviewduck.review.domain.ReviewComment;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.stream.Collectors;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class ReviewCommentsResponse {
    private long numberOfReviews;
    private boolean isMine;
    private boolean isLastPage;
    private List<ReviewCommentResponse> comments;

    public static ReviewCommentsResponse from(Page<ReviewComment> reviewComments) {
        return new ReviewCommentsResponse(
                reviewComments.getTotalElements(),
                true,
                reviewComments.isLast(),
                reviewComments.getContent().stream()
                        .map(ReviewCommentResponse::from)
                        .collect(Collectors.toList())
        );
    }
}
