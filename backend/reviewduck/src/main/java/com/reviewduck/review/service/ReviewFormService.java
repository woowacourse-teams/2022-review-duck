package com.reviewduck.review.service;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.reviewduck.template.domain.Template;
import com.reviewduck.template.domain.TemplateQuestion;
import com.reviewduck.common.exception.NotFoundException;
import com.reviewduck.review.domain.ReviewForm;
import com.reviewduck.review.domain.ReviewFormQuestion;
import com.reviewduck.review.dto.request.ReviewFormQuestionRequest;
import com.reviewduck.review.dto.request.ReviewFormCreateFromTemplateRequest;
import com.reviewduck.review.dto.request.ReviewFormCreateRequest;
import com.reviewduck.review.dto.request.ReviewFormUpdateRequest;
import com.reviewduck.review.repository.ReviewFormQuestionRepository;
import com.reviewduck.review.repository.ReviewFormRepository;
import com.reviewduck.template.service.TemplateService;

@Service
@Transactional
public class ReviewFormService {

	private final ReviewFormRepository reviewFormRepository;
	private final ReviewFormQuestionRepository reviewFormQuestionRepository;
	private final TemplateService templateService;

	public ReviewFormService(ReviewFormRepository reviewFormRepository,
		ReviewFormQuestionRepository reviewFormQuestionRepository, TemplateService templateService) {
		this.reviewFormRepository = reviewFormRepository;
		this.reviewFormQuestionRepository = reviewFormQuestionRepository;
		this.templateService = templateService;
	}

	public ReviewForm save(ReviewFormCreateRequest createRequest) {
		List<String> questionValues = createRequest.getQuestions().stream()
			.map(ReviewFormQuestionRequest::getQuestionValue)
			.collect(Collectors.toUnmodifiableList());

		ReviewForm reviewForm = new ReviewForm(createRequest.getReviewTitle(), questionValues);
		return reviewFormRepository.save(reviewForm);
	}

	@Transactional(readOnly = true)
	public ReviewForm findByCode(String code) {
		return reviewFormRepository.findByCode(code)
			.orElseThrow(() -> new NotFoundException("존재하지 않는 회고 폼입니다."));
	}

	public ReviewForm update(String code, ReviewFormUpdateRequest updateRequest) {
		ReviewForm reviewForm = findByCode(code);

		List<ReviewFormQuestion> reviewFormQuestions = updateRequest.getQuestions().stream()
			.map(request -> saveOrUpdateQuestion(request.getQuestionId(), request.getQuestionValue()))
			.collect(Collectors.toUnmodifiableList());

		reviewForm.update(updateRequest.getReviewTitle(), reviewFormQuestions);

		return reviewForm;
	}

	private ReviewFormQuestion saveOrUpdateQuestion(Long questionId, String questionValue) {
		if (Objects.isNull(questionId)) {
			return reviewFormQuestionRepository.save(new ReviewFormQuestion(questionValue));
		}

		ReviewFormQuestion reviewFormQuestion = reviewFormQuestionRepository.findById(questionId)
			.orElseThrow(() -> new NotFoundException("존재하지 않는 질문입니다."));

		reviewFormQuestion.updateValue(questionValue);

		return reviewFormQuestion;
	}

	public ReviewForm saveFromTemplate(Long templateId, ReviewFormCreateFromTemplateRequest request) {
		Template template = templateService.findById(templateId);

		List<String> questionValues = template.getQuestions().stream()
			.map(TemplateQuestion::getValue)
			.collect(Collectors.toUnmodifiableList());

		ReviewForm reviewForm = new ReviewForm(request.getReviewFormTitle(), questionValues);
		return reviewFormRepository.save(reviewForm);

	}
}
