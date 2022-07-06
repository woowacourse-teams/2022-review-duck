package com.reviewduck.service;

import java.util.List;
import java.util.stream.Collectors;

import javax.transaction.Transactional;

import org.springframework.stereotype.Service;

import com.reviewduck.domain.Review;
import com.reviewduck.domain.ReviewForm;
import com.reviewduck.dto.request.AnswerRequest;
import com.reviewduck.dto.request.ReviewCreateRequest;
import com.reviewduck.repository.ReviewRepository;

@Service
@Transactional
public class ReviewService {

    private final ReviewFormService reviewFormService;
    private final ReviewRepository reviewRepository;

    public ReviewService(ReviewFormService reviewFormService,
        ReviewRepository reviewRepository) {
        this.reviewFormService = reviewFormService;
        this.reviewRepository = reviewRepository;
    }

    public Review save(String code, ReviewCreateRequest request) {
        ReviewForm reviewForm = reviewFormService.findByCode(code);
        List<String> answerValues = request.getAnswers()
            .stream()
            .map(AnswerRequest::getAnswerValue)
            .collect(Collectors.toUnmodifiableList());

        Review review = Review.of(request.getNickname(), reviewForm, answerValues);

        return reviewRepository.save(review);
    }
}
