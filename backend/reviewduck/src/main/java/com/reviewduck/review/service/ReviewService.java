package com.reviewduck.review.service;

import java.util.ArrayList;
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
import com.reviewduck.review.domain.Answer;
import com.reviewduck.review.domain.QuestionAnswer;
import com.reviewduck.review.domain.Review;
import com.reviewduck.review.domain.ReviewForm;
import com.reviewduck.review.domain.ReviewFormQuestion;
import com.reviewduck.review.dto.controller.request.ReviewContentCreateRequest;
import com.reviewduck.review.dto.controller.request.ReviewContentUpdateRequest;
import com.reviewduck.review.dto.controller.request.ReviewCreateRequest;
import com.reviewduck.review.dto.controller.request.ReviewUpdateRequest;
import com.reviewduck.review.repository.ReviewRepository;
import com.reviewduck.review.dto.service.ReviewCreateDto;
import com.reviewduck.review.vo.ReviewSortType;

import lombok.AllArgsConstructor;

@Service
@Transactional(readOnly = true)
@AllArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;

    private final ReviewFormService reviewFormService;
    private final ReviewFormQuestionService reviewFormQuestionService;
    private final QuestionAnswerService questionAnswerService;
    private final AnswerService answerService;
    private final MemberService memberService;

    @Transactional
    public Review save(Member member, String code, ReviewCreateRequest request) {
        ReviewForm reviewForm = reviewFormService.findByCode(code);
        List<ReviewCreateDto> reviewCreateDtos = request.getContents().stream()
            .map(this::getReviewCreateDto)
            .collect(Collectors.toUnmodifiableList());

        Review review = new Review("title", member, reviewForm, reviewCreateDtos, request.getIsPrivate());
        return reviewRepository.save(review);
    }

    public Review findById(long reviewId) {
        return reviewRepository.findById(reviewId)
            .orElseThrow(() -> new NotFoundException("존재하지 않는 회고입니다."));
    }

    public Page<Review> findBySocialId(String socialId, Member member, int page, int size) {
        Member owner = memberService.getBySocialId(socialId);

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

        return reviewRepository.findByIsPrivateFalse(pageRequest);
    }

    @Transactional
    public Review update(Member member, Long id, ReviewUpdateRequest request) {
        Review review = findById(id);
        validateMyReview(member, review, "본인이 생성한 회고가 아니면 수정할 수 없습니다.");

        List<QuestionAnswer> updateQuestionAnswers = new ArrayList<>();

        for (ReviewContentUpdateRequest content : request.getContents()) {

            ReviewFormQuestion question = reviewFormQuestionService.findById(content.getQuestionId());

            Answer answer = answerService.findOrCreateAnswer(content.getAnswer().getId());
            answer.update(content.getAnswer().getValue());

            QuestionAnswer questionAnswer = questionAnswerService.getOrSave(question, answer);
            updateQuestionAnswers.add(questionAnswer);
        }

        review.update(request.getIsPrivate(), updateQuestionAnswers);
        return review;
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

    private ReviewCreateDto getReviewCreateDto(ReviewContentCreateRequest content) {
        ReviewFormQuestion reviewFormQuestion = reviewFormQuestionService.findById(content.getQuestionId());
        Answer answer = new Answer(content.getAnswer().getValue());

        return new ReviewCreateDto(reviewFormQuestion, answer);
    }

    private void validateMyReview(Member member, Review review, String message) {
        if (!review.isMine(member)) {
            throw new AuthorizationException(message);
        }
    }
}
