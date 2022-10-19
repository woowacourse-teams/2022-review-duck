package com.reviewduck.review.dto.controller.response;

import java.sql.Timestamp;
import java.util.List;
import java.util.Objects;

import com.reviewduck.member.domain.Member;
import com.reviewduck.member.dto.response.MemberDto;
import com.reviewduck.review.domain.Review;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class ReviewSheetResponse extends ReviewAbstractResponse {

    private Long id;
    private String reviewTitle;
    private long updatedAt;
    private int likes;
    private boolean isCreator;
    private CreatorResponse creator;
    private List<ReviewContentResponse> contents;

    public static ReviewSheetResponse of(long memberId, Review review) {
        List<ReviewContentResponse> contents = getSynchronizedReviewContents(review);

        return new ReviewSheetResponse(
            review.getId(),
            review.getTitle(),
            Timestamp.valueOf(review.getUpdatedAt()).getTime(),
            review.getLikes(),
            Objects.equals(review.getMember().getId(), memberId),
            // todo
            CreatorResponse.from(MemberDto.from(review.getMember())),
            contents
        );
    }

    public boolean getIsCreator() {
        return isCreator;
    }
}
