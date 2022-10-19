package com.reviewduck.review.dto.controller.response;

import java.sql.Timestamp;
import java.util.List;
import java.util.stream.Collectors;

import com.reviewduck.member.domain.Member;
import com.reviewduck.member.dto.response.MemberDto;
import com.reviewduck.review.domain.Review;
import com.reviewduck.review.domain.ReviewForm;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class ReviewResponse extends ReviewAbstractResponse {

    private Long id;
    private String reviewTitle;
    private long updatedAt;
    private int likes;
    private CreatorResponse creator;
    private boolean isCreator;
    private List<ReviewContentResponse> contents;
    private String reviewFormCode;

    public static ReviewResponse of(long memberId, Review review) {
        List<ReviewContentResponse> contents = review.getQuestionAnswers().stream()
            .map(ReviewContentResponse::from)
            .collect(Collectors.toUnmodifiableList());

        ReviewForm reviewForm = review.getReviewForm();

        return new ReviewResponse(
            review.getId(),
            review.getTitle(),
            Timestamp.valueOf(review.getUpdatedAt()).getTime(),
            review.getLikes(),
            CreatorResponse.from(MemberDto.from(review.getMember())),
            review.isMine(memberId),
            contents,
            reviewForm.getCode()
        );
    }

    public boolean getIsCreator() {
        return isCreator;
    }
}
