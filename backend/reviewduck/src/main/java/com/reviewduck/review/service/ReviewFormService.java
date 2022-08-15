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
import com.reviewduck.review.dto.request.ReviewFormUpdateRequest;
import com.reviewduck.review.repository.ReviewFormRepository;
import com.reviewduck.template.domain.Template;
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
        List<ReviewFormQuestion> questions = createRequest.getQuestions().stream()
            .map(request -> reviewFormQuestionService.save(request.getValue(), "-"))
            .collect(Collectors.toUnmodifiableList());

        ReviewForm reviewForm = new ReviewForm(member, createRequest.getReviewFormTitle(), questions);
        return reviewFormRepository.save(reviewForm);
    }

    @Transactional
    public ReviewForm saveFromTemplate(Member member, Long templateId, ReviewFormCreateFromTemplateRequest request) {
        Template template = templateService.findById(templateId);
        template.increaseUsedCount();

        List<ReviewFormQuestion> questions = template.getQuestions().stream()
            .map(t -> reviewFormQuestionService.save(t.getValue(), t.getDescription()))
            .collect(Collectors.toUnmodifiableList());

        ReviewForm reviewForm = new ReviewForm(member, request.getReviewFormTitle(), questions);
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
        validateReviewFormIsMine(member, reviewForm, "본인이 생성한 회고 폼이 아니면 수정할 수 없습니다.");

        List<ReviewFormQuestion> reviewFormQuestions = updateRequest.getQuestions().stream()
            .map(request -> reviewFormQuestionService.saveOrUpdateQuestion(request.getId(), request.getValue(), "-"))
            .collect(Collectors.toUnmodifiableList());

        reviewForm.update(updateRequest.getReviewFormTitle(), reviewFormQuestions);

        return reviewForm;
    }

    @Transactional
    public void deleteByCode(Member member, String reviewFormCode) {
        ReviewForm reviewForm = findByCode(reviewFormCode);
        validateReviewFormIsMine(member, reviewForm, "본인이 생성한 회고 폼이 아니면 삭제할 수 없습니다.");
        reviewFormRepository.delete(reviewForm.getId());
    }

    private void validateReviewFormIsMine(Member member, ReviewForm reviewForm, String message) {
        if (!reviewForm.isMine(member)) {
            throw new AuthorizationException(message);
        }
    }
}
