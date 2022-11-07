
package com.reviewduck.review.controller;

import static com.reviewduck.common.util.Logging.*;
import static com.reviewduck.common.vo.PageConstant.*;

import javax.validation.Valid;

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
import com.reviewduck.member.dto.MemberDto;
import com.reviewduck.review.dto.controller.request.ReviewCreateRequest;
import com.reviewduck.review.dto.controller.request.ReviewFormCreateRequest;
import com.reviewduck.review.dto.controller.request.ReviewFormUpdateRequest;
import com.reviewduck.review.dto.controller.response.MemberReviewFormsResponse;
import com.reviewduck.review.dto.controller.response.ReviewFormCodeResponse;
import com.reviewduck.review.dto.controller.response.ReviewFormResponse;
import com.reviewduck.review.dto.controller.response.ReviewsOfReviewFormResponse;
import com.reviewduck.review.service.ReviewFormAggregator;
import com.reviewduck.review.service.ReviewFormService;

import io.swagger.v3.oas.annotations.Operation;
import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/api/review-forms")
@AllArgsConstructor
public class ReviewFormController {

    private final ReviewFormAggregator aggregator;
    private final ReviewFormService reviewFormService;

    @Operation(summary = "회고 폼을 생성한다.")
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ReviewFormCodeResponse createReviewForm(@AuthenticationPrincipal MemberDto member,
        @RequestBody @Valid ReviewFormCreateRequest request) {

        info("/api/review-forms", "POST", request.toString());

        return reviewFormService.save(member.getId(), request);
    }

    @Operation(summary = "회고 답변을 생성한다.")
    @PostMapping("/{reviewFormCode}")
    @ResponseStatus(HttpStatus.CREATED)
    public void createReview(@AuthenticationPrincipal MemberDto member, @PathVariable String reviewFormCode,
        @RequestBody @Valid ReviewCreateRequest request) {

        info("/api/review-forms/" + reviewFormCode, "POST", request.toString());

        aggregator.createReview(member.getId(), reviewFormCode, request);
    }

    @Operation(summary = "특정 회고 폼의 정보를 조회한다.")
    @GetMapping("/{reviewFormCode}")
    @ResponseStatus(HttpStatus.OK)
    public ReviewFormResponse findReviewForm(@AuthenticationPrincipal MemberDto member,
        @PathVariable String reviewFormCode) {

        info("/api/review-forms/" + reviewFormCode, "GET", "");

        return reviewFormService.findByCode(reviewFormCode, member.getId());
    }

    @Operation(summary = "사용자가 작성한 회고 질문지 중 특정 페이지를 조회한다.")
    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public MemberReviewFormsResponse findPageOfReviewFormsBySocialId(@AuthenticationPrincipal MemberDto member,
        @RequestParam(value = "member") String socialId,
        @RequestParam(required = false, defaultValue = DEFAULT_PAGE) int page,
        @RequestParam(required = false, defaultValue = DEFAULT_SIZE) int size) {

        info("/api/review-forms?member=" + socialId + "page=" + page + " size=" + size, "GET", "");

        return reviewFormService.findBySocialId(socialId, page - 1, size, member);
    }

    @Operation(summary = "특정 회고 폼을 기반으로 작성된 회고 답변들을 모두 조회한다.")
    @GetMapping(value = "/{reviewFormCode}/reviews")
    @ResponseStatus(HttpStatus.OK)
    public ReviewsOfReviewFormResponse findReviewsByCode(@AuthenticationPrincipal MemberDto member,
        @PathVariable String reviewFormCode,
        @RequestParam(required = false, defaultValue = DEFAULT_PAGE) int page,
        @RequestParam(required = false, defaultValue = DEFAULT_SIZE) int size,
        @RequestParam(required = false, defaultValue = "list") String displayType) {

        info("/api/review-forms/" + reviewFormCode + "/reviews?displayType=" + displayType, "GET", "");

        return aggregator.findAllByCode(reviewFormCode, page - 1, size, displayType, member.getId());
    }

    @Operation(summary = "회고 폼을 수정한다.")
    @PutMapping("/{reviewFormCode}")
    @ResponseStatus(HttpStatus.OK)
    public ReviewFormCodeResponse updateReviewForm(@AuthenticationPrincipal MemberDto member,
        @PathVariable String reviewFormCode,
        @RequestBody @Valid ReviewFormUpdateRequest request) {

        info("/api/review-forms/" + reviewFormCode, "PUT", request.toString());

        return aggregator.update(member.getId(), reviewFormCode, request);
    }

    @Operation(summary = "회고 폼을 삭제한다.")
    @DeleteMapping("/{reviewFormCode}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteReviewForm(@AuthenticationPrincipal MemberDto member, @PathVariable String reviewFormCode) {

        info("/api/review-forms/" + reviewFormCode, "DELETE", "");

        aggregator.delete(member.getId(), reviewFormCode);
    }
}
