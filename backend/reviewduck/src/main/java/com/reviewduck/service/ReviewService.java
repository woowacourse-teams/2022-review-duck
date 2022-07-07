package com.reviewduck.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.transaction.Transactional;

import org.springframework.stereotype.Service;

import com.reviewduck.domain.Answer;
import com.reviewduck.domain.Question;
import com.reviewduck.domain.Review;
import com.reviewduck.domain.ReviewForm;
import com.reviewduck.dto.request.AnswerRequest;
import com.reviewduck.dto.request.ReviewCreateRequest;
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

    public Review save(String code, ReviewCreateRequest request) {
        ReviewForm reviewForm = reviewFormService.findByCode(code);

        Map<Question, Answer> answersByQuestions = convertToAnswersByQuestions(request.getAnswers());

        Review review = Review.of(request.getNickname(), reviewForm, answersByQuestions);
        return reviewRepository.save(review);
    }

    private Map<Question, Answer> convertToAnswersByQuestions(List<AnswerRequest> answerRequests) {
        Map<Question, Answer> answersByQuestions = new HashMap<>();

        for (AnswerRequest answerRequest : answerRequests) {
            Question question = questionRepository.findById(answerRequest.getQuestionId())
                .orElseThrow(() -> new NotFoundException("존재하지 않는 질문입니다."));
            answersByQuestions.put(question, new Answer(answerRequest.getAnswerValue()));
        }

        return answersByQuestions;
    }

    public List<Review> findAllByCode(String code) {
        ReviewForm reviewForm = reviewFormService.findByCode(code);
        return reviewRepository.findByReviewForm(reviewForm);
    }
}
