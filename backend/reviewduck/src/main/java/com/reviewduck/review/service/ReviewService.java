package com.reviewduck.review.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.reviewduck.auth.exception.AuthorizationException;
import com.reviewduck.common.exception.NotFoundException;
import com.reviewduck.member.domain.Member;
import com.reviewduck.review.domain.Answer;
import com.reviewduck.review.domain.QuestionAnswer;
import com.reviewduck.review.domain.Review;
import com.reviewduck.review.domain.ReviewForm;
import com.reviewduck.review.domain.ReviewFormQuestion;
import com.reviewduck.review.dto.request.AnswerRequest;
import com.reviewduck.review.dto.request.AnswerUpdateRequest;
import com.reviewduck.review.dto.request.ReviewRequest;
import com.reviewduck.review.dto.request.ReviewUpdateRequest;
import com.reviewduck.review.repository.ReviewRepository;

import lombok.AllArgsConstructor;

@Service
@Transactional(readOnly = true)
@AllArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;

    private final ReviewFormService reviewFormService;
    private final ReviewFormQuestionService reviewFormQuestionService;
    private final AnswerService answerService;

    @Transactional
    public Review save(Member member, String code, ReviewRequest request) {
        ReviewForm reviewForm = reviewFormService.findByCode(code);

        List<QuestionAnswer> questionAnswers = convertToQuestionAnswers(request.getAnswers());

        Review review = new Review(member, reviewForm, questionAnswers);
        return reviewRepository.save(review);
    }

    public Review findById(long reviewId) {
        return reviewRepository.findById(reviewId)
            .orElseThrow(() -> new NotFoundException("존재하지 않는 회고입니다."));
    }

    public List<Review> findByMember(Member member) {
        return reviewRepository.findByMember(member);
    }

    public List<Review> findAllByCode(String code) {
        ReviewForm reviewForm = reviewFormService.findByCode(code);
        return reviewRepository.findByReviewForm(reviewForm);
    }

    @Transactional
    public Review update(Member member, Long id, ReviewUpdateRequest request) {
        Review review = findById(id);
        validateMyReview(member, review, "본인이 생성한 회고가 아니면 수정할 수 없습니다.");

        for (AnswerUpdateRequest answerRequest : request.getAnswers()) {
            Answer answer = answerService.findById(answerRequest.getAnswerId());
            answer.update(answerRequest.getAnswerValue());
        }
        review.renewUpdatedAt();

        return review;
    }

    @Transactional
    public void delete(Member member, Long id) {
        Review review = findById(id);
        validateMyReview(member, review, "본인이 생성한 회고가 아니면 삭제할 수 없습니다.");

        reviewRepository.deleteById(id);
    }

    private List<QuestionAnswer> convertToQuestionAnswers(List<AnswerRequest> answerRequests) {
        List<QuestionAnswer> questionAnswers = new ArrayList<>();
        for (AnswerRequest answerRequest : answerRequests) {
            ReviewFormQuestion reviewFormQuestion = reviewFormQuestionService.findById(answerRequest.getQuestionId());
            questionAnswers.add(new QuestionAnswer(reviewFormQuestion, new Answer(answerRequest.getAnswerValue())));
        }

        return questionAnswers;
    }

    private void validateMyReview(Member member, Review review, String message) {
        if (!review.isMine(member)) {
            throw new AuthorizationException(message);
        }
    }
}
