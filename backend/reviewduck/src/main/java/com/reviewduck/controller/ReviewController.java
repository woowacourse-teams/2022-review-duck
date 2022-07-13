package com.reviewduck.controller;

import java.util.List;

import javax.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.reviewduck.domain.Review;
import com.reviewduck.dto.request.ReviewCreateRequest;
import com.reviewduck.dto.response.ReviewsFindResponse;
import com.reviewduck.service.ReviewFormService;
import com.reviewduck.service.ReviewService;

import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/review-forms/{reviewFormCode}")
@RequiredArgsConstructor
@Slf4j
public class ReviewController {

    private final ReviewService reviewService;
    private final ReviewFormService reviewFormService;

    @Operation(summary = "회고 답변을 생성한다.")
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public void create(@PathVariable String reviewFormCode, @RequestBody @Valid ReviewCreateRequest request) {

        log.info("uri={}, method = {}, request = {}",
            "/api/review-forms/" + reviewFormCode, "POST", request.toString());

        reviewService.save(reviewFormCode, request);
    }

    @Operation(summary = "특정 회고 폼을 기반으로 작성된 회고 답변들을 모두 조회한다.")
    @GetMapping("/reviews")
    @ResponseStatus(HttpStatus.OK)
    public ReviewsFindResponse findByCode(@PathVariable String reviewFormCode) {

        log.info("uri={}, method = {}, request = {}",
            "/api/review-forms/" + reviewFormCode + "/reviews", "GET", "");

        String reviewTitle = reviewFormService.findByCode(reviewFormCode).getReviewTitle();
        List<Review> reviews = reviewService.findAllByCode(reviewFormCode);

        return ReviewsFindResponse.of(reviewTitle, reviews);
    }
}
