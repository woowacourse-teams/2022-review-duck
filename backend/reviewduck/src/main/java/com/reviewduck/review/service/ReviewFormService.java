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
import com.reviewduck.member.dto.response.MemberDto;
import com.reviewduck.member.repository.MemberRepository;
import com.reviewduck.review.domain.ReviewForm;
import com.reviewduck.review.dto.controller.request.ReviewFormCreateRequest;
import com.reviewduck.review.dto.controller.request.ReviewFormUpdateRequest;
import com.reviewduck.review.dto.controller.response.MemberReviewFormsResponse;
import com.reviewduck.review.dto.controller.response.ReviewFormCodeResponse;
import com.reviewduck.review.dto.controller.response.ReviewFormResponse;
import com.reviewduck.review.dto.service.ReviewFormDto;
import com.reviewduck.review.dto.service.ReviewFormQuestionCreateDto;
import com.reviewduck.review.dto.service.ServiceDtoConverter;
import com.reviewduck.review.repository.ReviewFormRepository;
import com.reviewduck.review.repository.ReviewRepository;
import com.reviewduck.review.vo.ReviewFormSortType;
import com.reviewduck.template.domain.Template;
import com.reviewduck.template.repository.TemplateRepository;

import lombok.AllArgsConstructor;

@Service
@Transactional(readOnly = true)
@AllArgsConstructor
public class ReviewFormService {

    private final ReviewFormRepository reviewFormRepository;
    private final ReviewRepository reviewRepository;
    private final TemplateRepository templateRepository;
    private final MemberRepository memberRepository;

    @Transactional
    public ReviewFormCodeResponse save(Member member, ReviewFormCreateRequest createRequest) {
        ReviewForm reviewForm = new ReviewForm(member, createRequest.getReviewFormTitle(), ServiceDtoConverter.toReviewFormQuestionCreateDtos(createRequest.getQuestions()));
        return ReviewFormCodeResponse.from(reviewFormRepository.save(reviewForm));
    }

    @Transactional
    public ReviewFormCodeResponse saveFromTemplate(Member member, Long templateId) {
        Template template = templateRepository.findById(templateId)
            .orElseThrow(() -> new NotFoundException("존재하지 않는 템플릿입니다."));
        templateRepository.increaseUsedCount(templateId);

        List<ReviewFormQuestionCreateDto> questions = template.getQuestions().stream()
            .map(question -> new ReviewFormQuestionCreateDto(question.getValue(), question.getDescription()))
            .collect(Collectors.toUnmodifiableList());

        ReviewForm reviewForm = new ReviewForm(member, template.getTemplateTitle(), questions);
        return ReviewFormCodeResponse.from(reviewForm);
    }

    @Transactional
    public ReviewFormCodeResponse saveFromTemplate(Member member, Long templateId, ReviewFormCreateRequest request) {
        templateRepository.increaseUsedCount(templateId);

        return save(member, request);
    }

    public ReviewFormDto findByCode(String code) {
        return ReviewFormDto.from(reviewFormRepository.findByCodeAndIsActiveTrue(code)
            .orElseThrow(() -> new NotFoundException("존재하지 않는 회고 폼입니다.")));
    }

    public ReviewFormResponse findByCode(String code, Member member) {
        ReviewForm reviewForm = findReviewFormByCode(code);
        List<MemberDto> participants = findAllParticipantsByCode(reviewForm);
        return ReviewFormResponse.of(reviewForm, member, participants);
    }

    public MemberReviewFormsResponse findBySocialId(String socialId, int page, int size) {
        Member member = memberRepository.findBySocialId(socialId)
            .orElseThrow(() -> new NotFoundException("존재하지 않는 사용자입니다."));

        Sort sort = Sort.by(Sort.Direction.DESC, ReviewFormSortType.LATEST.getSortBy());
        PageRequest pageRequest = PageRequest.of(page, size, sort);

        Page<ReviewForm> reviewForms = reviewFormRepository.findByMemberAndIsActiveTrue(member,
            pageRequest);

        return MemberReviewFormsResponse.of(reviewForms, socialId, member);
    }

    @Transactional
    public ReviewFormCodeResponse update(Member member, String code, ReviewFormUpdateRequest updateRequest) {
        ReviewForm reviewForm = findReviewFormByCode(code);
        validateReviewFormIsMine(member, reviewForm, "본인이 생성한 회고 폼이 아니면 수정할 수 없습니다.");

        reviewForm.update(
            updateRequest.getReviewFormTitle(),
            ServiceDtoConverter.toReviewFormQuestionUpdateDtos(updateRequest.getQuestions())
        );

        return ReviewFormCodeResponse.from(reviewForm);
    }

    @Transactional
    public void deleteByCode(Member member, String reviewFormCode) {
        ReviewForm reviewForm = findReviewFormByCode(reviewFormCode);
        validateReviewFormIsMine(member, reviewForm, "본인이 생성한 회고 폼이 아니면 삭제할 수 없습니다.");
        if (reviewRepository.existsByReviewForm(reviewForm)) {
            reviewFormRepository.inactivate(reviewForm);
            return;
        }
        reviewFormRepository.delete(reviewForm);
    }

    private ReviewForm findReviewFormByCode(String code) {
        return reviewFormRepository.findByCodeAndIsActiveTrue(code)
            .orElseThrow(() -> new NotFoundException("존재하지 않는 회고 폼입니다."));
    }

    private List<MemberDto> findAllParticipantsByCode(ReviewForm reviewForm) {
        return memberRepository.findAllParticipantsByReviewFormCode(reviewForm)
            .stream()
            .map(MemberDto::from)
            .collect(Collectors.toUnmodifiableList());
    }

    private void validateReviewFormIsMine(Member member, ReviewForm reviewForm, String message) {
        if (!reviewForm.isMine(member)) {
            throw new AuthorizationException(message);
        }
    }
}
