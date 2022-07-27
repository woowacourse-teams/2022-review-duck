package com.reviewduck.review.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.reviewduck.common.exception.NotFoundException;
import com.reviewduck.review.domain.Answer;
import com.reviewduck.review.domain.QuestionAnswer;
import com.reviewduck.review.domain.Review;
import com.reviewduck.review.domain.ReviewForm;
import com.reviewduck.review.domain.ReviewFormQuestion;
import com.reviewduck.review.dto.request.AnswerRequest;
import com.reviewduck.review.dto.request.ReviewRequest;
import com.reviewduck.review.repository.ReviewFormQuestionRepository;
import com.reviewduck.review.repository.ReviewRepository;

@Service
@Transactional
public class ReviewService {

    private final ReviewFormService reviewFormService;
    private final ReviewRepository reviewRepository;
    private final ReviewFormQuestionRepository reviewFormQuestionRepository;

    public ReviewService(ReviewFormService reviewFormService,
        ReviewRepository reviewRepository, ReviewFormQuestionRepository reviewFormQuestionRepository) {
        this.reviewFormService = reviewFormService;
        this.reviewRepository = reviewRepository;
        this.reviewFormQuestionRepository = reviewFormQuestionRepository;
    }

    public Review save(String code, String nickName, ReviewRequest request) {
        ReviewForm reviewForm = reviewFormService.findByCode(code);

        List<QuestionAnswer> questionAnswers = convertToQuestionAnswers(request.getAnswers());

        Review review = Review.of(nickName, reviewForm, questionAnswers);
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
    public List<Review> findAllByCode(String code) {
        ReviewForm reviewForm = reviewFormService.findByCode(code);
        return reviewRepository.findByReviewForm(reviewForm);
    }

    public Review update(Long id, ReviewRequest request) {
        Review review = reviewRepository.findById(id)
            .orElseThrow(() -> new NotFoundException("존재하지 않는 회고입니다."));

        review.update(convertToQuestionAnswers(request.getAnswers()));
        return review;
    }

    public void delete(Long id) {
        if (!reviewRepository.existsById(id)) {
            throw new NotFoundException("존재하지 않는 회고입니다.");
        }
        reviewRepository.deleteById(id);
    }
}
