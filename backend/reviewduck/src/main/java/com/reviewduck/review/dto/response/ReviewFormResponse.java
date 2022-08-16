package com.reviewduck.review.dto.response;

import java.sql.Timestamp;
import java.util.List;
import java.util.stream.Collectors;

import com.reviewduck.member.domain.Member;
import com.reviewduck.review.domain.ReviewForm;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class ReviewFormResponse {

    private String reviewFormTitle;
    private long updatedAt;
    private CreatorResponse creator;
    private boolean isCreator;
    private List<ReviewFormQuestionResponse> questions;

    public static ReviewFormResponse of(ReviewForm reviewForm, Member member) {
        List<ReviewFormQuestionResponse> reviewFormQuestionResponse = reviewForm.getReviewFormQuestions().stream()
            .map(ReviewFormQuestionResponse::from)
            .collect(Collectors.toUnmodifiableList());

        return new ReviewFormResponse(
            reviewForm.getTitle(),
            Timestamp.valueOf(reviewForm.getUpdatedAt()).getTime(),
            CreatorResponse.from(reviewForm.getMember()),
            reviewForm.isMine(member),
            reviewFormQuestionResponse
        );
    }

    public boolean getIsCreator() {
        return isCreator;
    }
}
