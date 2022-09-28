package com.reviewduck.review.controller;

import static com.reviewduck.common.util.Logging.*;
import static com.reviewduck.common.vo.PageConstant.*;

import java.util.List;

import javax.validation.Valid;

import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.reviewduck.auth.support.AuthenticationPrincipal;
import com.reviewduck.member.domain.Member;
import com.reviewduck.review.domain.Review;
import com.reviewduck.review.domain.ReviewForm;
import com.reviewduck.review.dto.request.ReviewCreateRequest;
import com.reviewduck.review.dto.request.ReviewFormCreateRequest;
import com.reviewduck.review.dto.request.ReviewFormUpdateRequest;
import com.reviewduck.review.dto.response.MemberReviewFormsResponse;
import com.reviewduck.review.dto.response.ReviewFormCodeResponse;
import com.reviewduck.review.dto.response.ReviewFormResponse;
import com.reviewduck.review.dto.response.ReviewsOfReviewFormResponse;
import com.reviewduck.review.service.ReviewFormService;
import com.reviewduck.review.service.ReviewService;

import io.swagger.v3.oas.annotations.Operation;
import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/api/review-forms")
@AllArgsConstructor
public class ReviewFormController {

    private final ReviewFormService reviewFormService;
    private final ReviewService reviewService;

    @Operation(summary = "회고 폼을 생성한다.")
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ReviewFormCodeResponse createReviewForm(@AuthenticationPrincipal Member member,
        @RequestBody @Valid ReviewFormCreateRequest request) {

        info("/api/review-forms", "POST", request.toString());

        ReviewForm reviewForm = reviewFormService.save(member, request);
        return ReviewFormCodeResponse.from(reviewForm);
    }

    @Operation(summary = "회고 답변을 생성한다.")
    @PostMapping("/{reviewFormCode}")
    @ResponseStatus(HttpStatus.CREATED)
    public void createReview(@AuthenticationPrincipal Member member, @PathVariable String reviewFormCode,
        @RequestBody @Valid ReviewCreateRequest request) {

        info("/api/review-forms/" + reviewFormCode, "POST", request.toString());

        reviewService.save(member, reviewFormCode, request);
    }

    @Operation(summary = "특정 회고 폼의 정보를 조회한다.")
    @GetMapping("/{reviewFormCode}")
    @ResponseStatus(HttpStatus.OK)
    public ReviewFormResponse findReviewForm(@AuthenticationPrincipal Member member,
        @PathVariable String reviewFormCode) {

        info("/api/review-forms/" + reviewFormCode, "GET", "");

        ReviewForm reviewForm = reviewFormService.findByCode(reviewFormCode);
        List<Member> participants = reviewService.findAllParticipantsByCode(reviewFormCode);

        return ReviewFormResponse.of(reviewForm, member, participants);
    }

    @Operation(summary = "사용자가 작성한 회고 질문지 중 특정 페이지를 조회한다.")
    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public MemberReviewFormsResponse findPageOfReviewFormsBySocialId(@AuthenticationPrincipal Member member,
        @RequestParam(value = "member") String socialId,
        @RequestParam(required = false, defaultValue = DEFAULT_PAGE) int page,
        @RequestParam(required = false, defaultValue = DEFAULT_SIZE) int size) {

        info("/api/review-forms?member=" + socialId + "page=" + page + " size=" + size, "GET", "");

        Page<ReviewForm> reviewForms = reviewFormService.findBySocialId(socialId, page - 1, size);

        return MemberReviewFormsResponse.of(reviewForms, socialId, member);
    }

    @Operation(summary = "특정 회고 폼을 기반으로 작성된 회고 답변들을 모두 조회한다.")
    @GetMapping(value = "/{reviewFormCode}/reviews")
    @ResponseStatus(HttpStatus.OK)
    public ReviewsOfReviewFormResponse findReviewsByCode(@AuthenticationPrincipal Member member,
        @PathVariable String reviewFormCode,
        @RequestParam(required = false, defaultValue = DEFAULT_PAGE) int page,
        @RequestParam(required = false, defaultValue = DEFAULT_SIZE) int size,
        @RequestParam(required = false, defaultValue = "list") String displayType) {

        info("/api/review-forms/" + reviewFormCode + "/reviews?displayType=" + displayType, "GET", "");

        Page<Review> reviews = reviewService.findAllByCode(reviewFormCode, page - 1, size);

        return ReviewsOfReviewFormResponse.of(member, reviews, displayType);
    }

    @Operation(summary = "회고 폼을 수정한다.")
    @PutMapping("/{reviewFormCode}")
    @ResponseStatus(HttpStatus.OK)
    public ReviewFormCodeResponse updateReviewForm(@AuthenticationPrincipal Member member,
        @PathVariable String reviewFormCode,
        @RequestBody @Valid ReviewFormUpdateRequest request) {

        info("/api/review-forms/" + reviewFormCode, "PUT", request.toString());

        ReviewForm reviewForm = reviewFormService.update(member, reviewFormCode, request);
        return ReviewFormCodeResponse.from(reviewForm);
    }

    @Operation(summary = "회고 폼을 삭제한다.")
    @DeleteMapping("/{reviewFormCode}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteReviewForm(@AuthenticationPrincipal Member member, @PathVariable String reviewFormCode) {

        info("/api/review-forms/" + reviewFormCode, "DELETE", "");

        reviewFormService.deleteByCode(member, reviewFormCode);
    }
}
