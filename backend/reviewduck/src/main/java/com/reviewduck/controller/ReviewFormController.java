package com.reviewduck.controller;

import javax.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.reviewduck.domain.ReviewForm;
import com.reviewduck.dto.ReviewFormCreateRequest;
import com.reviewduck.dto.ReviewFormCreateResponse;
import com.reviewduck.service.ReviewFormService;

@RestController
@RequestMapping("/api/review-forms")
public class ReviewFormController {

    private final ReviewFormService reviewFormService;

    public ReviewFormController(ReviewFormService reviewFormService) {
        this.reviewFormService = reviewFormService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ReviewFormCreateResponse create(@RequestBody @Valid ReviewFormCreateRequest request) {
        ReviewForm reviewForm = reviewFormService.save(request);
        return ReviewFormCreateResponse.from(reviewForm);
    }
}
