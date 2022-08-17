package com.reviewduck.review.dto.response;

import com.reviewduck.review.domain.ReviewFormQuestion;
import com.reviewduck.template.domain.TemplateQuestion;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class ReviewFormQuestionResponse {

    private Long id;
    private String value;
    private String description;

    public static ReviewFormQuestionResponse from(ReviewFormQuestion reviewFormQuestion) {
        return new ReviewFormQuestionResponse(reviewFormQuestion.getId(), reviewFormQuestion.getValue(),
            reviewFormQuestion.getDescription());
    }

    public static ReviewFormQuestionResponse from(TemplateQuestion question) {
        return new ReviewFormQuestionResponse(question.getId(), question.getValue(), question.getDescription());
    }
}
