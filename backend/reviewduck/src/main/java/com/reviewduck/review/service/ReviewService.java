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
import com.reviewduck.review.repository.AnswerRepository;
import com.reviewduck.review.repository.ReviewFormQuestionRepository;
import com.reviewduck.review.repository.ReviewRepository;

import lombok.AllArgsConstructor;

@Service
@Transactional
@AllArgsConstructor
public class ReviewService {

    private final ReviewFormService reviewFormService;
    private final ReviewRepository reviewRepository;
    private final ReviewFormQuestionRepository reviewFormQuestionRepository;
    private final AnswerRepository answerRepository;

    public Review save(Member member, String code, ReviewRequest request) {
        ReviewForm reviewForm = reviewFormService.findByCode(code);

        List<QuestionAnswer> questionAnswers = convertToQuestionAnswers(request.getAnswers());

        Review review = new Review(member, reviewForm, questionAnswers);
        return reviewRepository.save(review);
    }

    private List<QuestionAnswer> convertToQuestionAnswers(List<AnswerRequest> answerRequests) {
        List<QuestionAnswer> questionAnswers = new ArrayList<>();
        for (AnswerRequest answerRequest : answerRequests) {
            ReviewFormQuestion reviewFormQuestion = reviewFormQuestionRepository.findById(answerRequest.getQuestionId())
                .orElseThrow(() -> new NotFoundException("존재하지 않는 질문입니다."));
            questionAnswers.add(new QuestionAnswer(reviewFormQuestion, new Answer(answerRequest.getAnswerValue())));
        }

        return questionAnswers;
    }

    @Transactional(readOnly = true)
    public Review findById(long reviewId) {
        Review review = reviewRepository.findById(reviewId)
            .orElseThrow(() -> new NotFoundException("존재하지 않는 회고입니다."));

        return review;
    }

    @Transactional(readOnly = true)
    public List<Review> findAllByCode(String code) {
        ReviewForm reviewForm = reviewFormService.findByCode(code);
        return reviewRepository.findByReviewForm(reviewForm);
    }

    public Review update(Member member, Long id, ReviewUpdateRequest request) {
        Review review = findById(id);
        validateMyReview(member, review, "본인이 생성한 회고가 아니면 수정할 수 없습니다.");

        for (AnswerUpdateRequest answerRequest : request.getAnswers()) {
            Answer answer = answerRepository.findById(answerRequest.getAnswerId())
                .orElseThrow(() -> new NotFoundException("존재하지 않는 답변입니다."));

            answer.update(answerRequest.getAnswerValue());
        }

        return review;
    }

    public void delete(Member member, Long id) {
        Review review = findById(id);
        validateMyReview(member, review, "본인이 생성한 회고가 아니면 삭제할 수 없습니다.");

        reviewRepository.deleteById(id);
    }

    public List<Review> findByMember(Member member) {
        return reviewRepository.findByMember(member);
    }

    private void validateMyReview(Member member, Review review, String message) {
        if (!review.isMine(member)) {
            throw new AuthorizationException(message);
        }
    }

}
