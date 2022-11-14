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
import com.reviewduck.review.dto.controller.response.ReviewEditResponse;
import com.reviewduck.review.dto.controller.response.ReviewEditResponseBuilder;
import com.reviewduck.review.dto.controller.response.ReviewLikesResponse;
import com.reviewduck.review.dto.controller.response.ReviewsOfReviewFormResponse;
import com.reviewduck.review.dto.controller.response.ReviewsResponse;
import com.reviewduck.review.dto.controller.response.TimelineReviewsResponse;
import com.reviewduck.review.dto.service.QuestionAnswerCreateDto;
import com.reviewduck.review.dto.service.QuestionAnswerUpdateDto;
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

    // ReviewForm 관련 코드를 위해 남겨두었음.
    @Transactional
    public Review save(long memberId, String code, ReviewCreateRequest request) {
        ReviewForm reviewForm = findReviewFormByCode(code);
        List<QuestionAnswerCreateDto> questionAnswerCreateDtos = getReviewCreateDtos(request);
        Member member = findMemberById(memberId);
        Review review = new Review(request.getTitle(), member, reviewForm, questionAnswerCreateDtos,
            request.getIsPrivate());
        return reviewRepository.save(review);
    }

    @Transactional
    public void newSave(long memberId, String code, ReviewCreateRequest request) {
        ReviewForm reviewForm = findReviewFormByCode(code);
        List<QuestionAnswerCreateDto> questionAnswerCreateDtos = getReviewCreateDtos(request);
        Member member = findMemberById(memberId);
        Review review = new Review(request.getTitle(), member, reviewForm, questionAnswerCreateDtos,
            request.getIsPrivate());
        reviewRepository.save(review);
    }

    public ReviewEditResponse findById(long id) {
        Review review = reviewRepository.findById(id)
            .orElseThrow(() -> new NotFoundException("존재하지 않는 회고입니다."));
        return ReviewEditResponseBuilder.createResponseFrom(review);
    }

    public ReviewsResponse findAllBySocialId(String socialId, long memberId, int page, int size) {
        Member owner = findMemberBySocialId(socialId);

        Sort sort = Sort.by(Sort.Direction.DESC, ReviewSortType.LATEST.getSortBy());
        PageRequest pageRequest = PageRequest.of(page, size, sort);
        Page<Review> reviews = getReviewsByOwner(memberId, owner, pageRequest);

        return ReviewsResponse.of(reviews, owner.isSameId(memberId));
    }

    //reviewForm 관련으로 인해 남겨두었음
    public Page<Review> findAllByCode(String code, int page, int size) {
        ReviewForm reviewForm = findReviewFormByCode(code);

        Sort sort = Sort.by(Sort.Direction.DESC, ReviewSortType.LATEST.getSortBy());
        PageRequest pageRequest = PageRequest.of(page, size, sort);

        return reviewRepository.findByReviewForm(reviewForm, pageRequest);
    }

    public ReviewsOfReviewFormResponse newFindAllByCode(String reviewFormCode, int page, int size,
        String displayType, long memberId) {
        ReviewForm reviewForm = findReviewFormByCode(reviewFormCode);

        Sort sort = Sort.by(Sort.Direction.DESC, ReviewSortType.LATEST.getSortBy());
        PageRequest pageRequest = PageRequest.of(page, size, sort);
        Page<Review> reviews = reviewRepository.findByReviewForm(reviewForm, pageRequest);

        return ReviewsOfReviewFormResponse.of(memberId, reviews, displayType);
    }

    public TimelineReviewsResponse findAllPublic(int page, int size, String sort, long memberId) {
        String sortType = ReviewSortType.getSortBy(sort);
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, sortType));
        Page<Review> reviews = getTimelineReviews(sort, pageRequest);
        return TimelineReviewsResponse.of(reviews, memberId);
    }

    @Transactional
    public void update(long memberId, long id, ReviewUpdateRequest request) {
        Review review = findReviewById(id);
        validateMyReview(memberId, review, "본인이 생성한 회고가 아니면 수정할 수 없습니다.");

        List<QuestionAnswerUpdateDto> questionAnswerUpdateDtos = getQuestionAnswerUpdateDtos(request);

        review.update(request.getIsPrivate(), request.getTitle(), questionAnswerUpdateDtos);
    }

    @Transactional
    public ReviewLikesResponse increaseLikes(long id, int likeCount) {
        Review review = findReviewById(id);
        reviewRepository.increaseLikes(review, likeCount);
        int likes = findReviewById(id).getLikes();
        return new ReviewLikesResponse(likes);
    }

    @Transactional
    public void delete(long memberId, long id) {
        Review review = findReviewById(id);
        validateMyReview(memberId, review, "본인이 생성한 회고가 아니면 삭제할 수 없습니다.");

        reviewRepository.deleteById(id);
    }

    private Review findReviewById(long id) {
        return reviewRepository.findById(id)
            .orElseThrow(() -> new NotFoundException("존재하지 않는 회고입니다."));
    }

    private void validateMyReview(long memberId, Review review, String message) {
        if (!review.isMine(memberId)) {
            throw new AuthorizationException(message);
        }
    }

    private Page<Review> getReviewsByOwner(long memberId, Member owner, PageRequest pageRequest) {
        if (owner.isSameId(memberId)) {
            return reviewRepository.findByMember(owner, pageRequest);
        }
        return reviewRepository.findByMemberAndIsPrivateFalse(owner, pageRequest);
    }

    private Page<Review> getTimelineReviews(String sort, PageRequest pageRequest) {
        if (ReviewSortType.isTrend(sort)) {
            return reviewRepository.findByIsPrivateFalseAndLikesGreaterThan(
                pageRequest, 50);
        }
        return reviewRepository.findByIsPrivateFalse(pageRequest);
    }

    /* -- Entity 에서 일괄 연관객체 생성을 위한 메서드 --- */
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

    /* -- 연관 Entity 조회용 메서드 -- */
    private Member findMemberById(long memberId) {
        return memberRepository.findById(memberId)
            .orElseThrow(() -> new NotFoundException("존재하지 않는 사용자입니다."));
    }

    private Member findMemberBySocialId(String socialId) {
        return memberRepository.findBySocialId(socialId)
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
}
