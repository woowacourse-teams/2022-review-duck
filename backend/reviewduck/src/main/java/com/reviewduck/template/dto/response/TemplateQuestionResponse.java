package com.reviewduck.template.dto.response;

import com.reviewduck.review.domain.ReviewFormQuestion;
import com.reviewduck.template.domain.TemplateQuestion;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class TemplateQuestionResponse {

	private Long questionId;
	private String questionValue;

	public static TemplateQuestionResponse from(ReviewFormQuestion reviewFormQuestion) {
		return new TemplateQuestionResponse(reviewFormQuestion.getId(), reviewFormQuestion.getValue());
	}

	public static TemplateQuestionResponse from(TemplateQuestion question) {
		return new TemplateQuestionResponse(question.getId(), question.getValue());
	}
}
