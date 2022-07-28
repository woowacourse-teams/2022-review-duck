package com.reviewduck.review.dto.response;

import java.sql.Timestamp;
import java.util.List;
import java.util.stream.Collectors;

import com.reviewduck.member.domain.Member;
import com.reviewduck.review.domain.Review;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class ReviewResponse {

    private Long reviewId;
    private long updatedAt;
    private boolean isMine;
    private CreatorResponse participant;
    private List<AnswerResponse> answers;

    public static ReviewResponse of(Member member, Review review, boolean isMine) {
        List<AnswerResponse> answerResponses = review.getQuestionAnswers().stream()
            .map(
                questionAnswer -> AnswerResponse.of(questionAnswer.getReviewFormQuestion(), questionAnswer.getAnswer()))
            .collect(Collectors.toUnmodifiableList());

        return new ReviewResponse(
            review.getId(),
            Timestamp.valueOf(review.getUpdatedAt()).getTime(),
            isMine,
            CreatorResponse.from(member),
            answerResponses
        );
    }

    public boolean getIsMine() {
        return isMine;
    }
}
