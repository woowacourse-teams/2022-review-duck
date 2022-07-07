package com.reviewduck.dto.response;

import java.util.List;
import java.util.stream.Collectors;

import com.reviewduck.domain.Review;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class ReviewResponse {

    private Long reviewId;
    private String nickname;
    private List<AnswerResponse> answers;

    public static ReviewResponse from(Review review) {
        List<AnswerResponse> answerResponses = review.getAnswersByQuestions().entrySet().stream()
            .map(entry -> AnswerResponse.of(entry.getKey(), entry.getValue()))
            .collect(Collectors.toUnmodifiableList());

        return new ReviewResponse(review.getId(), review.getNickname(), answerResponses);
    }
}
