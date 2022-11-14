package com.reviewduck.review.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.reviewduck.auth.exception.AuthorizationException;
import com.reviewduck.common.exception.NotFoundException;
import com.reviewduck.member.domain.Member;
import com.reviewduck.member.dto.MemberDto;
import com.reviewduck.member.repository.MemberRepository;
import com.reviewduck.review.domain.ReviewForm;
import com.reviewduck.review.dto.controller.request.ReviewCreateRequest;
import com.reviewduck.review.dto.controller.request.ReviewFormCreateRequest;
import com.reviewduck.review.dto.controller.request.ReviewFormUpdateRequest;
import com.reviewduck.review.dto.controller.response.MemberReviewFormsResponse;
import com.reviewduck.review.dto.controller.response.ReviewFormCodeResponse;
import com.reviewduck.review.dto.controller.response.ReviewFormResponse;
import com.reviewduck.review.dto.service.ReviewFormQuestionCreateDto;
import com.reviewduck.review.dto.service.ServiceDtoConverter;
import com.reviewduck.review.repository.ReviewFormRepository;
import com.reviewduck.review.repository.ReviewRepository;
import com.reviewduck.review.vo.ReviewFormSortType;

import lombok.AllArgsConstructor;

@Service
@Transactional(readOnly = true)
@AllArgsConstructor
public class ReviewFormService {

    private final ReviewFormRepository reviewFormRepository;
    private final ReviewRepository reviewRepository;
    private final MemberRepository memberRepository;

    @Transactional
    public ReviewFormCodeResponse save(long memberId, ReviewFormCreateRequest createRequest) {
        ReviewForm saveReviewForm = saveReviewForm(memberId, createRequest);
        return ReviewFormCodeResponse.from(saveReviewForm);
    }

    public ReviewFormResponse findByCode(String reviewFormCode, long memberId) {
        ReviewForm reviewForm = getReviewFormByCode(reviewFormCode);
        List<Member> members = memberRepository.findAllParticipantsByReviewForm(reviewForm);

        return ReviewFormResponse.of(reviewForm, reviewForm.isMine(memberId), members);
    }

    public MemberReviewFormsResponse findBySocialId(String socialId, int page, int size, MemberDto member) {
        Member creator = memberRepository.findBySocialId(socialId)
            .orElseThrow(() -> new NotFoundException("존재하지 않는 사용자입니다."));

        Sort sort = Sort.by(Sort.Direction.DESC, ReviewFormSortType.LATEST.getSortBy());
        PageRequest pageRequest = PageRequest.of(page, size, sort);

        Page<ReviewForm> reviewForms = reviewFormRepository.findByMemberAndIsActiveTrue(creator, pageRequest);
        return MemberReviewFormsResponse.of(reviewForms, socialId, member);
    }

    @Transactional
    public ReviewFormCodeResponse update(long memberId, String code, ReviewFormUpdateRequest updateRequest) {
        ReviewForm reviewForm = getReviewFormByCode(code);
        validateReviewFormIsMine(memberId, reviewForm, "본인이 생성한 회고 폼이 아니면 수정할 수 없습니다.");

        reviewForm.update(
            updateRequest.getReviewFormTitle(),
            ServiceDtoConverter.toReviewFormQuestionUpdateDtos(updateRequest.getQuestions())
        );

        return ReviewFormCodeResponse.from(reviewForm);
    }

    @Transactional
    public void deleteByCode(long memberId, String reviewFormCode) {
        ReviewForm reviewForm = getReviewFormByCode(reviewFormCode);
        validateReviewFormIsMine(memberId, reviewForm, "본인이 생성한 회고 폼이 아니면 삭제할 수 없습니다.");
        if (reviewRepository.existsByReviewForm(reviewForm)) {
            reviewFormRepository.inactivate(reviewForm);
            return;
        }
        reviewFormRepository.delete(reviewForm);
    }

    private ReviewForm saveReviewForm(long memberId, ReviewFormCreateRequest createRequest) {
        Member member = findMemberById(memberId);
        List<ReviewFormQuestionCreateDto> questions = ServiceDtoConverter.toReviewFormQuestionCreateDtos(
            createRequest.getQuestions());
        ReviewForm reviewForm = new ReviewForm(member, createRequest.getReviewFormTitle(), questions);
        return reviewFormRepository.save(reviewForm);
    }

    private ReviewForm getReviewFormByCode(String code) {
        return reviewFormRepository.findByCodeAndIsActiveTrue(code)
            .orElseThrow(() -> new NotFoundException("존재하지 않는 회고 폼입니다."));
    }

    private Member findMemberById(long memberId) {
        return memberRepository.findById(memberId)
            .orElseThrow(() -> new NotFoundException("존재하지 않는 사용자입니다."));
    }

    private void validateReviewFormIsMine(long memberId, ReviewForm reviewForm, String message) {
        if (!reviewForm.isMine(memberId)) {
            throw new AuthorizationException(message);
        }
    }
}
