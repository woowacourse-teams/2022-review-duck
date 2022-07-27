package com.reviewduck.review.dto.response;

import java.sql.Timestamp;
import java.util.List;
import java.util.stream.Collectors;

import com.reviewduck.review.domain.Review;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class ReviewResponse {

    private Long reviewId;
    private String nickname;
    private List<AnswerResponse> answers;
    private long updatedAt;

    public static ReviewResponse from(Review review) {
        List<AnswerResponse> answerResponses = review.getQuestionAnswers().stream()
            .map(
                questionAnswer -> AnswerResponse.of(questionAnswer.getReviewFormQuestion(), questionAnswer.getAnswer()))
            .collect(Collectors.toUnmodifiableList());

        return new ReviewResponse(review.getId(), review.getMember().getNickname(), answerResponses,
            Timestamp.valueOf(review.getUpdatedAt()).getTime());
    }
}
