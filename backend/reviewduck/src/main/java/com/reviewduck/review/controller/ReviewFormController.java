package com.reviewduck.review.controller;

import java.util.List;

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

import com.reviewduck.auth.support.AuthenticationPrincipal;
import com.reviewduck.member.domain.Member;
import com.reviewduck.review.domain.Review;
import com.reviewduck.review.domain.ReviewForm;
import com.reviewduck.review.dto.request.ReviewFormCreateRequest;
import com.reviewduck.review.dto.request.ReviewFormUpdateRequest;
import com.reviewduck.review.dto.request.ReviewRequest;
import com.reviewduck.review.dto.response.MyReviewFormsResponse;
import com.reviewduck.review.dto.response.ReviewFormCodeResponse;
import com.reviewduck.review.dto.response.ReviewFormResponse;
import com.reviewduck.review.dto.response.ReviewsFindResponse;
import com.reviewduck.review.service.ReviewFormService;
import com.reviewduck.review.service.ReviewService;

import io.swagger.v3.oas.annotations.Operation;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/review-forms")
@Slf4j
public class ReviewFormController {

    private final ReviewFormService reviewFormService;
    private final ReviewService reviewService;

    public ReviewFormController(ReviewFormService reviewFormService, ReviewService reviewService) {
        this.reviewFormService = reviewFormService;
        this.reviewService = reviewService;
    }

    @Operation(summary = "회고 폼을 생성한다.")
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ReviewFormCodeResponse create(@AuthenticationPrincipal Member member,
        @RequestBody @Valid ReviewFormCreateRequest request) {

        log.info("uri={}, method = {}, request = {}",
            "/api/review-forms", "POST", request.toString());

        ReviewForm reviewForm = reviewFormService.save(member, request);
        return ReviewFormCodeResponse.from(reviewForm);
    }

    @Operation(summary = "특정 회고폼의 정보를 조회한다.")
    @GetMapping("/{reviewFormCode}")
    @ResponseStatus(HttpStatus.OK)
    public ReviewFormResponse find(@AuthenticationPrincipal Member member, @PathVariable String reviewFormCode) {

        log.info("uri={}, method = {}, request = {}",
            "/api/review-forms/" + reviewFormCode, "GET", "");

        ReviewForm reviewForm = reviewFormService.findByCode(reviewFormCode);
        boolean isCreator = reviewFormService.isReviewFormCreator(reviewForm, member);

        return ReviewFormResponse.of(reviewForm, isCreator);
    }

    @Operation(summary = "회고 폼을 수정한다.")
    @PutMapping("/{reviewFormCode}")
    @ResponseStatus(HttpStatus.OK)
    public ReviewFormCodeResponse update(@AuthenticationPrincipal Member member, @PathVariable String reviewFormCode,
        @RequestBody @Valid ReviewFormUpdateRequest request) {

        log.info("uri={}, method = {}, request = {}",
            "/api/review-forms/" + reviewFormCode, "PUT", request.toString());

        ReviewForm reviewForm = reviewFormService.update(member, reviewFormCode, request);
        return ReviewFormCodeResponse.from(reviewForm);
    }

    @Operation(summary = "회고 답변을 생성한다.")
    @PostMapping("/{reviewFormCode}")
    @ResponseStatus(HttpStatus.CREATED)
    public void create(@AuthenticationPrincipal Member member, @PathVariable String reviewFormCode,
        @RequestBody @Valid ReviewRequest request) {

        log.info("uri={}, method = {}, request = {}",
            "/api/review-forms/" + reviewFormCode, "POST", request.toString());

        reviewService.save(member, reviewFormCode, request);
    }

    @Operation(summary = "특정 회고 폼을 기반으로 작성된 회고 답변들을 모두 조회한다.")
    @GetMapping("/{reviewFormCode}/reviews")
    @ResponseStatus(HttpStatus.OK)
    public ReviewsFindResponse findByCode(@AuthenticationPrincipal Member member, @PathVariable String reviewFormCode) {

        log.info("uri={}, method = {}, request = {}",
            "/api/review-forms/" + reviewFormCode + "/reviews", "GET", "");

        ReviewForm reviewForm = reviewFormService.findByCode(reviewFormCode);
        List<Review> reviews = reviewService.findAllByCode(reviewFormCode);

        return ReviewsFindResponse.of(reviewForm, reviews);
    }

    @Operation(summary = "내가 작성한 회고폼을 모두 조회한다.")
    @GetMapping("/me")
    @ResponseStatus(HttpStatus.OK)
    public MyReviewFormsResponse findByMember(@AuthenticationPrincipal Member member) {

        log.info("uri={}, method = {}, request = {}",
            "/api/review-forms/me", "GET", "");

        List<ReviewForm> reviewForms = reviewFormService.findByMember(member);

        return MyReviewFormsResponse.of(reviewForms);
    }
}
