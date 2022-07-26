package com.reviewduck.review.dto.response;

import com.reviewduck.template.domain.TemplateQuestion;
import com.reviewduck.review.domain.ReviewFormQuestion;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class ReviewFormQuestionResponse {

	private Long questionId;
	private String questionValue;

	public static ReviewFormQuestionResponse from(ReviewFormQuestion reviewFormQuestion) {
		return new ReviewFormQuestionResponse(reviewFormQuestion.getId(), reviewFormQuestion.getValue());
	}

	public static ReviewFormQuestionResponse from(TemplateQuestion question) {
		return new ReviewFormQuestionResponse(question.getId(), question.getValue());
	}
}
