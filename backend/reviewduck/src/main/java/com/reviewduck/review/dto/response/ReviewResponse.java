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

    private Long reviewId;
    private long updatedAt;
    private boolean isMine;
    private CreatorResponse participant;
    private List<AnswerResponse> answers;

    public static ReviewResponse of(Member member, Review review) {
        List<AnswerResponse> answerResponses = review.getQuestionAnswers().stream()
            .map(
                questionAnswer -> AnswerResponse.of(questionAnswer.getReviewFormQuestion(), questionAnswer.getAnswer()))
            .collect(Collectors.toUnmodifiableList());

        return new ReviewResponse(
            review.getId(),
            Timestamp.valueOf(review.getUpdatedAt()).getTime(),
            review.isMine(member),
            CreatorResponse.from(review.getMember()),
            answerResponses
        );
    }

    public boolean getIsMine() {
        return isMine;
    }
}
