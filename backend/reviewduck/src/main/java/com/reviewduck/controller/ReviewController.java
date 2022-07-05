package com.reviewduck.controller;

import javax.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.reviewduck.dto.request.ReviewCreateRequest;
import com.reviewduck.service.ReviewService;

@RestController
@RequestMapping("/api/review-forms/{reviewFormCode}")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public void create(@PathVariable String reviewFormCode, @RequestBody @Valid ReviewCreateRequest request) {
        reviewService.save(reviewFormCode, request);
    }
}
