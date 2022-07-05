package com.reviewduck.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.reviewduck.domain.ReviewForm;
import com.reviewduck.dto.request.ReviewFormCreateRequest;
import com.reviewduck.exception.NotFoundException;
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

    @Transactional(readOnly = true)
    public ReviewForm findByCode(String code) {
        return reviewFormRepository.findByCode(code)
            .orElseThrow(() -> new NotFoundException("존재하지 않는 입장코드입니다."));
    }
}
