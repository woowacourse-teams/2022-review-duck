package com.reviewduck.controller;

import javax.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.reviewduck.domain.ReviewForm;
import com.reviewduck.dto.request.ReviewFormCreateRequest;
import com.reviewduck.dto.request.ReviewFormUpdateRequest;
import com.reviewduck.dto.response.ReviewFormCodeResponse;
import com.reviewduck.dto.response.ReviewFormResponse;
import com.reviewduck.service.ReviewFormService;

import io.swagger.v3.oas.annotations.Operation;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/review-forms")
@Slf4j
public class ReviewFormController {

    private final ReviewFormService reviewFormService;

    public ReviewFormController(ReviewFormService reviewFormService) {
        this.reviewFormService = reviewFormService;
    }

    @Operation(summary = "회고 폼을 생성한다.")
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ReviewFormCodeResponse create(@RequestBody @Valid ReviewFormCreateRequest request) {

        log.info("uri={}, method = {}, request = {}",
            "/api/review-forms", "POST", request.toString());

        ReviewForm reviewForm = reviewFormService.save(request);
        return ReviewFormCodeResponse.from(reviewForm);
    }

    @Operation(summary = "회고 폼의 질문들을 모두 조회한다.")
    @GetMapping("/{reviewFormCode}")
    @ResponseStatus(HttpStatus.OK)
    public ReviewFormResponse find(@PathVariable String reviewFormCode) {

        log.info("uri={}, method = {}, request = {}",
            "/api/review-forms/" + reviewFormCode, "GET", "");

        ReviewForm reviewForm = reviewFormService.findByCode(reviewFormCode);
        return ReviewFormResponse.from(reviewForm);
    }

    @Operation(summary = "회고 폼을 수정한다.")
    @PutMapping("/{reviewFormCode}")
    @ResponseStatus(HttpStatus.OK)
    public ReviewFormCodeResponse update(@PathVariable String reviewFormCode,
        @RequestBody @Valid ReviewFormUpdateRequest request) {

        log.info("uri={}, method = {}, request = {}",
            "/api/review-forms/" + reviewFormCode, "PUT", request.toString());

        ReviewForm reviewForm = reviewFormService.update(reviewFormCode, request);
        return ReviewFormCodeResponse.from(reviewForm);
    }
}
