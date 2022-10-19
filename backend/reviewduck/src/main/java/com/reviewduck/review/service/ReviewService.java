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
import com.reviewduck.member.repository.MemberRepository;
import com.reviewduck.review.domain.Answer;
import com.reviewduck.review.domain.Review;
import com.reviewduck.review.domain.ReviewForm;
import com.reviewduck.review.domain.ReviewFormQuestion;
import com.reviewduck.review.dto.controller.request.ReviewContentCreateRequest;
import com.reviewduck.review.dto.controller.request.ReviewContentUpdateRequest;
import com.reviewduck.review.dto.controller.request.ReviewCreateRequest;
import com.reviewduck.review.dto.controller.request.ReviewUpdateRequest;
import com.reviewduck.review.dto.service.QuestionAnswerCreateDto;
import com.reviewduck.review.dto.service.QuestionAnswerUpdateDto;
import com.reviewduck.review.dto.service.ReviewDto;
import com.reviewduck.review.repository.ReviewFormQuestionRepository;
import com.reviewduck.review.repository.ReviewFormRepository;
import com.reviewduck.review.repository.ReviewRepository;
import com.reviewduck.review.vo.ReviewSortType;

import lombok.AllArgsConstructor;

@Service
@Transactional(readOnly = true)
@AllArgsConstructor
public class ReviewService {

    private final ReviewFormRepository reviewFormRepository;
    private final ReviewRepository reviewRepository;
    private final ReviewFormQuestionRepository reviewFormQuestionRepository;
    private final MemberRepository memberRepository;

    @Transactional
    public ReviewDto save(long memberId, String code, ReviewCreateRequest request) {
        ReviewForm reviewForm = findReviewFormByCode(code);
        List<QuestionAnswerCreateDto> questionAnswerCreateDtos = getReviewCreateDtos(request);
        Member member = findMemberById(memberId);
        Review review = new Review(request.getTitle(), member, reviewForm, questionAnswerCreateDtos,
            request.getIsPrivate());
        return ReviewDto.from(reviewRepository.save(review));
    }

    public Review findById(long id) {
        return reviewRepository.findById(id)
            .orElseThrow(() -> new NotFoundException("존재하지 않는 회고입니다."));
    }

    public Page<Review> findAllBySocialId(Member owner, long memberId, int page, int size) {
        Sort sort = Sort.by(Sort.Direction.DESC, ReviewSortType.LATEST.getSortBy());
        PageRequest pageRequest = PageRequest.of(page, size, sort);
        return getPagedReviews(memberId, owner, pageRequest);
    }

    public Page<Review> findAllByCode(String code, int page, int size) {
        ReviewForm reviewForm = findReviewFormByCode(code);

        Sort sort = Sort.by(Sort.Direction.DESC, ReviewSortType.LATEST.getSortBy());
        PageRequest pageRequest = PageRequest.of(page, size, sort);

        return reviewRepository.findByReviewForm(reviewForm, pageRequest);
    }

    public Page<Review> findAllPublic(int page, int size, String sort) {
        String sortType = ReviewSortType.getSortBy(sort);
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, sortType));
        return getPagedTimelineReviews(sort, pageRequest);
    }

    @Transactional
    public void update(long memberId, Long id, ReviewUpdateRequest request) {
        Review review = findById(id);
        Member member = findMemberById(memberId);
        validateMyReview(member, review, "본인이 생성한 회고가 아니면 수정할 수 없습니다.");

        List<QuestionAnswerUpdateDto> questionAnswerUpdateDtos = getQuestionAnswerUpdateDtos(request);

        review.update(request.getIsPrivate(), request.getTitle(), questionAnswerUpdateDtos);
    }
    @Transactional
    public int increaseLikes(Long id, int likeCount) {
        Review review = findById(id);
        reviewRepository.increaseLikes(review, likeCount);
        return findById(id).getLikes();
    }

    @Transactional
    public void delete(long memberId, Long id) {
        Review review = findById(id);
        Member member = findMemberById(memberId);
        validateMyReview(member, review, "본인이 생성한 회고가 아니면 삭제할 수 없습니다.");

        reviewRepository.deleteById(id);
    }

    private Page<Review> getPagedReviews(long memberId, Member owner, PageRequest pageRequest) {
        if (owner.isSameId(memberId)) {
            return reviewRepository.findByMember(owner, pageRequest);
        }
        return reviewRepository.findByMemberAndIsPrivateFalse(owner, pageRequest);
    }

    private Page<Review> getPagedTimelineReviews(String sort, PageRequest pageRequest) {
        if (ReviewSortType.isTrend(sort)) {
            return reviewRepository.findByIsPrivateFalseAndLikesGreaterThan(
                pageRequest, 50);
        }
        return reviewRepository.findByIsPrivateFalse(pageRequest);
    }

    private List<QuestionAnswerCreateDto> getReviewCreateDtos(ReviewCreateRequest request) {
        return request.getContents().stream()
            .map(this::getReviewCreateDto)
            .collect(Collectors.toUnmodifiableList());
    }

    private QuestionAnswerCreateDto getReviewCreateDto(ReviewContentCreateRequest request) {
        ReviewFormQuestion reviewFormQuestion = findReviewFormQuestionById(request.getQuestionId());
        Answer answer = new Answer(request.getAnswer().getValue());

        return new QuestionAnswerCreateDto(reviewFormQuestion, answer);
    }

    private List<QuestionAnswerUpdateDto> getQuestionAnswerUpdateDtos(ReviewUpdateRequest request) {
        return request.getContents().stream()
            .map(this::getReviewUpdateDto)
            .collect(Collectors.toUnmodifiableList());
    }

    private QuestionAnswerUpdateDto getReviewUpdateDto(ReviewContentUpdateRequest request) {
        ReviewFormQuestion reviewFormQuestion = findReviewFormQuestionById(request.getQuestionId());
        String answerValue = request.getAnswer().getValue();

        return new QuestionAnswerUpdateDto(reviewFormQuestion, answerValue);
    }

    private Member findMemberById(long memberId) {
        return memberRepository.findById(memberId)
            .orElseThrow(() -> new NotFoundException("존재하지 않는 사용자입니다."));
    }

    private ReviewForm findReviewFormByCode(String code) {
        return reviewFormRepository.findByCodeAndIsActiveTrue(code)
            .orElseThrow(() -> new NotFoundException("존재하지 않는 회고 폼입니다."));
    }

    private ReviewFormQuestion findReviewFormQuestionById(long questionId) {
        return reviewFormQuestionRepository.findById(questionId)
            .orElseThrow(() -> new NotFoundException("존재하지 않는 질문입니다."));
    }

    private void validateMyReview(Member member, Review review, String message) {
        if (!review.isMine(member)) {
            throw new AuthorizationException(message);
        }
    }
}
