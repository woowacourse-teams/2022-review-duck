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
import com.reviewduck.member.service.MemberService;
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
import com.reviewduck.review.repository.ReviewRepository;
import com.reviewduck.review.vo.ReviewSortType;

import lombok.AllArgsConstructor;

@Service
@Transactional(readOnly = true)
@AllArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final MemberRepository memberRepository;

    private final ReviewFormService reviewFormService;
    private final ReviewFormQuestionService reviewFormQuestionService;

    @Transactional
    public Review save(Member member, String code, ReviewCreateRequest request) {
        ReviewForm reviewForm = reviewFormService.findByCode(code);
        List<QuestionAnswerCreateDto> questionAnswerCreateDtos = getReviewCreateDtos(request);

        Review review = new Review(request.getTitle(), member, reviewForm, questionAnswerCreateDtos,
            request.getIsPrivate());
        return reviewRepository.save(review);
    }

    public Review findById(long reviewId) {
        return reviewRepository.findById(reviewId)
            .orElseThrow(() -> new NotFoundException("존재하지 않는 회고입니다."));
    }

    public Page<Review> findBySocialId(String socialId, Member member, int page, int size) {
        Member owner = memberRepository.findBySocialId(socialId)
            .orElseThrow(() -> new NotFoundException("존재하지 않는 사용자입니다."));

        Sort sort = Sort.by(Sort.Direction.DESC, ReviewSortType.LATEST.getSortBy());
        PageRequest pageRequest = PageRequest.of(page, size, sort);

        if (member.equals(owner)) {
            return reviewRepository.findByMember(member, pageRequest);
        }

        return reviewRepository.findByMemberAndIsPrivateFalse(owner, pageRequest);
    }

    public Page<Review> findAllByCode(String code, int page, int size) {
        ReviewForm reviewForm = reviewFormService.findByCode(code);

        Sort sort = Sort.by(Sort.Direction.DESC, ReviewSortType.LATEST.getSortBy());
        PageRequest pageRequest = PageRequest.of(page, size, sort);

        return reviewRepository.findByReviewForm(reviewForm, pageRequest);
    }

    public Page<Review> findAllPublic(int page, int size, String sort) {
        String sortType = ReviewSortType.getSortBy(sort);
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, sortType));

        if (ReviewSortType.isTrend(sort)) {
            return reviewRepository.findByIsPrivateFalseAndLikesGreaterThan(pageRequest, 50);
        }

        return reviewRepository.findByIsPrivateFalse(pageRequest);
    }

    @Transactional
    public void update(Member member, Long id, ReviewUpdateRequest request) {
        Review review = findById(id);
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
    public void delete(Member member, Long id) {
        Review review = findById(id);
        validateMyReview(member, review, "본인이 생성한 회고가 아니면 삭제할 수 없습니다.");

        reviewRepository.deleteById(id);
    }

    private List<QuestionAnswerCreateDto> getReviewCreateDtos(ReviewCreateRequest request) {
        return request.getContents().stream()
            .map(this::getReviewCreateDto)
            .collect(Collectors.toUnmodifiableList());
    }

    private QuestionAnswerCreateDto getReviewCreateDto(ReviewContentCreateRequest request) {
        ReviewFormQuestion reviewFormQuestion = reviewFormQuestionService.findById(request.getQuestionId());
        Answer answer = new Answer(request.getAnswer().getValue());

        return new QuestionAnswerCreateDto(reviewFormQuestion, answer);
    }

    private List<QuestionAnswerUpdateDto> getQuestionAnswerUpdateDtos(ReviewUpdateRequest request) {
        return request.getContents().stream()
            .map(this::getReviewUpdateDto)
            .collect(Collectors.toUnmodifiableList());
    }

    private QuestionAnswerUpdateDto getReviewUpdateDto(ReviewContentUpdateRequest request) {
        ReviewFormQuestion reviewFormQuestion = reviewFormQuestionService.findById(request.getQuestionId());
        String answerValue = request.getAnswer().getValue();

        return new QuestionAnswerUpdateDto(reviewFormQuestion, answerValue);
    }

    private void validateMyReview(Member member, Review review, String message) {
        if (!review.isMine(member)) {
            throw new AuthorizationException(message);
        }
    }
}
