package com.reviewduck.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.reviewduck.domain.ReviewForm;
import com.reviewduck.dto.ReviewFormCreateRequest;
import com.reviewduck.repository.ReviewFormRepository;

@Service
@Transactional
public class ReviewFormService {

    private final ReviewFormRepository reviewFormRepository;

    public ReviewFormService(ReviewFormRepository reviewFormRepository) {
        this.reviewFormRepository = reviewFormRepository;
    }

    public ReviewForm save(ReviewFormCreateRequest createRequest) {
        ReviewForm reviewForm = new ReviewForm(createRequest.getReviewTitle(), createRequest.getQuestions());
        return reviewFormRepository.save(reviewForm);
    }
}
