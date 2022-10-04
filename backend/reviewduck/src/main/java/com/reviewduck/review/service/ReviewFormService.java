package com.reviewduck.review.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.reviewduck.auth.exception.AuthorizationException;
import com.reviewduck.common.exception.NotFoundException;
import com.reviewduck.member.domain.Member;
import com.reviewduck.member.repository.MemberRepository;
import com.reviewduck.member.service.MemberService;
import com.reviewduck.review.domain.Review;
import com.reviewduck.review.domain.ReviewForm;
import com.reviewduck.review.domain.ReviewFormQuestion;
import com.reviewduck.review.dto.controller.request.ReviewFormCreateRequest;
import com.reviewduck.review.dto.controller.request.ReviewFormUpdateRequest;
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
    private final MemberRepository memberRepository;

    private final ReviewFormQuestionService reviewFormQuestionService;
    private final TemplateService templateService;
    private final MemberService memberService;

    @Transactional
    public ReviewForm save(Member member, ReviewFormCreateRequest createRequest) {
        List<ReviewFormQuestion> questions = createRequest.getQuestions().stream()
            .map(request -> reviewFormQuestionService.save(request.getValue(), request.getDescription()))
            .collect(Collectors.toUnmodifiableList());

        ReviewForm reviewForm = new ReviewForm(member, createRequest.getReviewFormTitle(), questions);
        return reviewFormRepository.save(reviewForm);
    }

    @Transactional
    public ReviewForm saveFromTemplate(Member member, Long templateId) {
        Template template = templateService.findById(templateId);
        templateService.increaseUsedCount(templateId);

        List<ReviewFormQuestion> questions = template.getQuestions().stream()
            .map(question -> reviewFormQuestionService.save(question.getValue(), question.getDescription()))
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

        List<ReviewFormQuestion> reviewFormQuestions = updateRequest.getQuestions().stream()
            .map(request -> reviewFormQuestionService.saveOrUpdateQuestion(request.getId(), request.getValue(),
                request.getDescription()))
            .collect(Collectors.toUnmodifiableList());

        reviewForm.update(updateRequest.getReviewFormTitle(), reviewFormQuestions);

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

    public List<Member> findAllParticipantsByCode(ReviewForm reviewForm) {
        return memberRepository.findAllParticipantsByReviewFormCode(reviewForm);
    }
}
