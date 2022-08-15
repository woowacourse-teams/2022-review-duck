package com.reviewduck.review.dto.response;

import com.reviewduck.review.domain.ReviewFormQuestion;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class QuestionResponse {

    private Long id;
    private String value;

    public static QuestionResponse from(ReviewFormQuestion reviewFormQuestion) {
        return new QuestionResponse(reviewFormQuestion.getId(), reviewFormQuestion.getValue());
    }
}
