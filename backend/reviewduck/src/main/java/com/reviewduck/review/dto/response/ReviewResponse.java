package com.reviewduck.review.dto.response;

import java.sql.Timestamp;
import java.util.List;
import java.util.stream.Collectors;

import com.reviewduck.member.domain.Member;
import com.reviewduck.review.domain.Review;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class ReviewResponse {

    private Long id;
    private long updatedAt;
    private boolean isCreator;
    private CreatorResponse creator;
    private List<ReviewContentResponse> contents;

    public static ReviewResponse of(Member member, Review review) {
        List<ReviewContentResponse> contents = review.getQuestionAnswers().stream()
            .map(ReviewContentResponse::from)
            .collect(Collectors.toUnmodifiableList());

        return new ReviewResponse(
            review.getId(),
            Timestamp.valueOf(review.getUpdatedAt()).getTime(),
            review.isMine(member),
            CreatorResponse.from(review.getMember()),
            contents
        );
    }

    public boolean getIsCreator() {
        return isCreator;
    }
}
