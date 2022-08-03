package com.reviewduck.review.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.reviewduck.auth.exception.AuthorizationException;
import com.reviewduck.common.exception.NotFoundException;
import com.reviewduck.member.domain.Member;
import com.reviewduck.review.domain.ReviewForm;
import com.reviewduck.review.domain.ReviewFormQuestion;
import com.reviewduck.review.dto.request.ReviewFormCreateFromTemplateRequest;
import com.reviewduck.review.dto.request.ReviewFormCreateRequest;
import com.reviewduck.review.dto.request.ReviewFormQuestionRequest;
import com.reviewduck.review.dto.request.ReviewFormUpdateRequest;
import com.reviewduck.review.repository.ReviewFormRepository;
import com.reviewduck.template.domain.Template;
import com.reviewduck.template.domain.TemplateQuestion;
import com.reviewduck.template.service.TemplateService;

import lombok.AllArgsConstructor;

@Service
@Transactional(readOnly = true)
@AllArgsConstructor
public class ReviewFormService {

    private final ReviewFormRepository reviewFormRepository;

    private final ReviewFormQuestionService reviewFormQuestionService;
    private final TemplateService templateService;

    @Transactional
    public ReviewForm save(Member member, ReviewFormCreateRequest createRequest) {
        List<String> questionValues = createRequest.getQuestions().stream()
            .map(ReviewFormQuestionRequest::getQuestionValue)
            .collect(Collectors.toUnmodifiableList());

        ReviewForm reviewForm = new ReviewForm(member, createRequest.getReviewTitle(), questionValues);
        return reviewFormRepository.save(reviewForm);
    }

    @Transactional
    public ReviewForm saveFromTemplate(Member member, Long templateId, ReviewFormCreateFromTemplateRequest request) {
        Template template = templateService.findById(templateId);

        List<String> questionValues = template.getQuestions().stream()
            .map(TemplateQuestion::getValue)
            .collect(Collectors.toUnmodifiableList());

        ReviewForm reviewForm = new ReviewForm(member, request.getReviewFormTitle(), questionValues);
        return reviewFormRepository.save(reviewForm);

    }

    public ReviewForm findByCode(String code) {
        return reviewFormRepository.findByCode(code)
            .orElseThrow(() -> new NotFoundException("존재하지 않는 회고 폼입니다."));
    }

    public List<ReviewForm> findByMember(Member member) {
        return reviewFormRepository.findByMember(member);
    }

    @Transactional
    public ReviewForm update(Member member, String code, ReviewFormUpdateRequest updateRequest) {
        ReviewForm reviewForm = findByCode(code);

        List<ReviewFormQuestion> reviewFormQuestions = updateRequest.getQuestions().stream()
            .map(request -> reviewFormQuestionService.saveOrUpdateQuestion(request.getQuestionId(),
                request.getQuestionValue()))
            .collect(Collectors.toUnmodifiableList());

        validateReviewFormIsMine(member, reviewForm, "본인이 생성한 회고 폼이 아니면 수정할 수 없습니다.");

        reviewForm.update(updateRequest.getReviewTitle(), reviewFormQuestions);

        return reviewForm;
    }

    @Transactional
    public void deleteByCode(Member member, String reviewFormCode) {
        ReviewForm reviewForm = findByCode(reviewFormCode);
        validateReviewFormIsMine(member, reviewForm, "본인이 생성한 회고 폼이 아니면 삭제할 수 없습니다.");
        reviewFormRepository.delete(reviewForm);
    }

    private void validateReviewFormIsMine(Member member, ReviewForm reviewForm, String message) {
        if (!reviewForm.isMine(member)) {
            throw new AuthorizationException(message);
        }
    }
}
