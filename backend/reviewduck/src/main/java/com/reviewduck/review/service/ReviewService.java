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
import com.reviewduck.review.dto.controller.response.ReviewsOfReviewFormResponse;
import com.reviewduck.review.dto.controller.response.ReviewsResponse;
import com.reviewduck.review.dto.controller.response.TimelineReviewsResponse;
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
    public ReviewDto save(Member member, String code, ReviewCreateRequest request) {
        ReviewForm reviewForm = findReviewFormByCode(code);
        List<QuestionAnswerCreateDto> questionAnswerCreateDtos = getReviewCreateDtos(request);

        Review review = new Review(request.getTitle(), member, reviewForm, questionAnswerCreateDtos,
            request.getIsPrivate());
        return ReviewDto.from(reviewRepository.save(review));
    }

    public ReviewEditResponse findEditedById(long reviewId) {
        return ReviewEditResponseBuilder.createResponseFrom(findReviewById(reviewId));
    }

    public ReviewDto findById(long reviewId) {
        return ReviewDto.from(findReviewById(reviewId));
    }

    public ReviewsResponse findAllBySocialId(String socialId, Member member, int page, int size) {
        Member owner = memberRepository.findBySocialId(socialId)
            .orElseThrow(() -> new NotFoundException("존재하지 않는 사용자입니다."));

        Sort sort = Sort.by(Sort.Direction.DESC, ReviewSortType.LATEST.getSortBy());
        PageRequest pageRequest = PageRequest.of(page, size, sort);

        if (member.equals(owner)) {
            Page<Review> reviews = reviewRepository.findByMember(member, pageRequest);
            return ReviewsResponse.of(reviews, socialId, member);
        }

        Page<Review> reviews = reviewRepository.findByMemberAndIsPrivateFalse(owner, pageRequest);
        return ReviewsResponse.of(reviews, socialId, member);
    }

    public ReviewsOfReviewFormResponse findAllByCode(String code, int page, int size, String displayType, Member member) {
        ReviewForm reviewForm = findReviewFormByCode(code);

        Sort sort = Sort.by(Sort.Direction.DESC, ReviewSortType.LATEST.getSortBy());
        PageRequest pageRequest = PageRequest.of(page, size, sort);

        Page<Review> reviews = reviewRepository.findByReviewForm(reviewForm, pageRequest);
        return ReviewsOfReviewFormResponse.of(member, reviews, displayType);
    }

    public TimelineReviewsResponse findAllPublic(int page, int size, String sort,
        Member member) {
        String sortType = ReviewSortType.getSortBy(sort);
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, sortType));

        if (ReviewSortType.isTrend(sort)) {
            Page<Review> reviews = reviewRepository.findByIsPrivateFalseAndLikesGreaterThan(
                pageRequest, 50);
            return TimelineReviewsResponse.of(reviews, member);
        }

        Page<Review> reviews = reviewRepository.findByIsPrivateFalse(pageRequest);
        return TimelineReviewsResponse.of(reviews, member);
    }

    @Transactional
    public void update(Member member, Long id, ReviewUpdateRequest request) {
        Review review = findReviewById(id);
        validateMyReview(member, review, "본인이 생성한 회고가 아니면 수정할 수 없습니다.");

        List<QuestionAnswerUpdateDto> questionAnswerUpdateDtos = getQuestionAnswerUpdateDtos(request);

        review.update(request.getIsPrivate(), request.getTitle(), questionAnswerUpdateDtos);
    }

    @Transactional
    public int increaseLikes(Long id, int likeCount) {
        Review review = findReviewById(id);
        reviewRepository.increaseLikes(review, likeCount);
        return findReviewById(id).getLikes();
    }

    @Transactional
    public void delete(Member member, Long id) {
        Review review = findReviewById(id);
        validateMyReview(member, review, "본인이 생성한 회고가 아니면 삭제할 수 없습니다.");

        reviewRepository.deleteById(id);
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

    private Review findReviewById(long id) {
        return reviewRepository.findById(id)
            .orElseThrow(() -> new NotFoundException("존재하지 않는 회고입니다."));
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
