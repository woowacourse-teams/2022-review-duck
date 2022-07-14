package com.reviewduck.service;

import java.util.ArrayList;
import java.util.List;

import javax.transaction.Transactional;

import org.springframework.stereotype.Service;

import com.reviewduck.domain.Answer;
import com.reviewduck.domain.Question;
import com.reviewduck.domain.QuestionAnswer;
import com.reviewduck.domain.Review;
import com.reviewduck.domain.ReviewForm;
import com.reviewduck.dto.request.AnswerRequest;
import com.reviewduck.dto.request.ReviewRequest;
import com.reviewduck.exception.NotFoundException;
import com.reviewduck.repository.QuestionRepository;
import com.reviewduck.repository.ReviewRepository;

@Service
@Transactional
public class ReviewService {

    private final ReviewFormService reviewFormService;
    private final ReviewRepository reviewRepository;
    private final QuestionRepository questionRepository;

    public ReviewService(ReviewFormService reviewFormService,
        ReviewRepository reviewRepository, QuestionRepository questionRepository) {
        this.reviewFormService = reviewFormService;
        this.reviewRepository = reviewRepository;
        this.questionRepository = questionRepository;
    }

    public Review save(String code, ReviewRequest request) {
        ReviewForm reviewForm = reviewFormService.findByCode(code);

        List<QuestionAnswer> questionAnswers = convertToQuestionAnswers(request.getAnswers());

        Review review = Review.of(request.getNickname(), reviewForm, questionAnswers);
        return reviewRepository.save(review);
    }

    private List<QuestionAnswer> convertToQuestionAnswers(List<AnswerRequest> answerRequests) {
        List<QuestionAnswer> questionAnswers = new ArrayList<>();
        for (AnswerRequest answerRequest : answerRequests) {
            Question question = questionRepository.findById(answerRequest.getQuestionId())
                .orElseThrow(() -> new NotFoundException("존재하지 않는 질문입니다."));
            questionAnswers.add(new QuestionAnswer(question, new Answer(answerRequest.getAnswerValue())));
        }

        return questionAnswers;
    }

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
