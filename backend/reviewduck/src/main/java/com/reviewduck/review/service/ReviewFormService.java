package com.reviewduck.review.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.reviewduck.auth.exception.AuthorizationException;
import com.reviewduck.common.exception.NotFoundException;
import com.reviewduck.member.domain.Member;
import com.reviewduck.member.service.MemberService;
import com.reviewduck.review.domain.ReviewForm;
import com.reviewduck.review.dto.controller.request.ReviewFormCreateRequest;
import com.reviewduck.review.dto.controller.request.ReviewFormUpdateRequest;
import com.reviewduck.review.dto.service.ReviewFormQuestionCreateDto;
import com.reviewduck.review.dto.service.ServiceDtoConverter;
import com.reviewduck.review.repository.ReviewFormRepository;
import com.reviewduck.review.repository.ReviewRepository;
import com.reviewduck.review.vo.ReviewFormSortType;
import com.reviewduck.template.domain.Template;
import com.reviewduck.template.service.TemplateService;

import lombok.AllArgsConstructor;

@Service
@Transactional(readOnly = true)
@AllArgsConstructor
public class ReviewFormService {

    private final ReviewFormRepository reviewFormRepository;

    private final ReviewRepository reviewRepository;
    private final TemplateService templateService;
    private final MemberService memberService;

    @Transactional
    public ReviewForm save(Member member, ReviewFormCreateRequest createRequest) {
        ReviewForm reviewForm = new ReviewForm(member, createRequest.getReviewFormTitle(), ServiceDtoConverter.toReviewFormQuestionCreateDtos(createRequest.getQuestions()));
        return reviewFormRepository.save(reviewForm);
    }

    @Transactional
    public ReviewForm saveFromTemplate(Member member, Long templateId) {
        Template template = templateService.findById(templateId);
        templateService.increaseUsedCount(templateId);

        List<ReviewFormQuestionCreateDto> questions = template.getQuestions().stream()
            .map(question -> new ReviewFormQuestionCreateDto(question.getValue(), question.getDescription()))
            .collect(Collectors.toUnmodifiableList());

        ReviewForm reviewForm = new ReviewForm(member, template.getTemplateTitle(), questions);
        return reviewFormRepository.save(reviewForm);
    }

    @Transactional
    public ReviewForm saveFromTemplate(Member member, Long templateId, ReviewFormCreateRequest request) {
        templateService.increaseUsedCount(templateId);

        return save(member, request);
    }

    public ReviewForm findByCode(String code) {
        return reviewFormRepository.findByCodeAndIsActiveTrue(code)
            .orElseThrow(() -> new NotFoundException("존재하지 않는 회고 폼입니다."));
    }

    public Page<ReviewForm> findBySocialId(String socialId, int page, int size) {
        Member member = memberService.getBySocialId(socialId);

        Sort sort = Sort.by(Sort.Direction.DESC, ReviewFormSortType.LATEST.getSortBy());
        PageRequest pageRequest = PageRequest.of(page, size, sort);

        return reviewFormRepository.findByMemberAndIsActiveTrue(member, pageRequest);
    }

    @Transactional
    public ReviewForm update(Member member, String code, ReviewFormUpdateRequest updateRequest) {
        ReviewForm reviewForm = findByCode(code);
        validateReviewFormIsMine(member, reviewForm, "본인이 생성한 회고 폼이 아니면 수정할 수 없습니다.");

        reviewForm.update(
            updateRequest.getReviewFormTitle(),
            ServiceDtoConverter.toReviewFormQuestionUpdateDtos(updateRequest.getQuestions())
        );

        return reviewForm;
    }

    @Transactional
    public void deleteByCode(Member member, String reviewFormCode) {
        ReviewForm reviewForm = findByCode(reviewFormCode);
        validateReviewFormIsMine(member, reviewForm, "본인이 생성한 회고 폼이 아니면 삭제할 수 없습니다.");
        if (reviewRepository.existsByReviewForm(reviewForm)) {
            reviewFormRepository.deleteSoftly(reviewForm);
            return;
        }
        reviewFormRepository.delete(reviewForm);
    }

    private void validateReviewFormIsMine(Member member, ReviewForm reviewForm, String message) {
        if (!reviewForm.isMine(member)) {
            throw new AuthorizationException(message);
        }
    }
}
