package com.reviewduck.review.controller;

import static com.reviewduck.common.util.Logging.*;
import static com.reviewduck.review.vo.ReviewPageConstant.*;

import javax.validation.Valid;

import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.reviewduck.auth.support.AuthenticationPrincipal;
import com.reviewduck.member.domain.Member;
import com.reviewduck.review.domain.Review;
import com.reviewduck.review.dto.request.ReviewUpdateRequest;
import com.reviewduck.review.dto.response.ReviewSynchronizedResponse;
import com.reviewduck.review.dto.response.ReviewsResponse;
import com.reviewduck.review.dto.response.TimelineReviewsResponse;
import com.reviewduck.review.service.ReviewService;

import io.swagger.annotations.ApiParam;
import io.swagger.v3.oas.annotations.Operation;
import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/api/reviews")
@AllArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @Operation(summary = "특정한 회고 답변을 최신화된 회고 폼과 동기화하여 조회한다.")
    @GetMapping("/{reviewId}")
    @ResponseStatus(HttpStatus.OK)
    public ReviewSynchronizedResponse findById(@AuthenticationPrincipal Member member, @PathVariable Long reviewId) {

        info("/api/reviews/" + reviewId, "GET", "");

        return ReviewSynchronizedResponse.from(reviewService.findById(reviewId));
    }

    @Operation(summary = "사용자가 작성한 회고 답변을 모두 조회한다.")
    @GetMapping(params = "member")
    @ResponseStatus(HttpStatus.OK)
    public ReviewsResponse findBySocialId(@AuthenticationPrincipal Member member,
        @ApiParam(name = "사용자 socialId") @RequestParam(value = "member") String socialId,
        @ApiParam(name = "페이지 번호") @RequestParam(required = false, defaultValue = DEFAULT_PAGE) Integer page,
        @ApiParam(name = "페이지 당 게시물 수") @RequestParam(required = false, defaultValue = DEFAULT_SIZE) Integer size
    ) {

        info("/api/reviews?member=" + socialId + "&page=" + page + "&size=" + size, "GET", "");

        Page<Review> reviews = reviewService.findBySocialId(socialId, member, page - 1, size);

        return ReviewsResponse.of(reviews, socialId, member);
    }

    @Operation(summary = "비밀글이 아닌 회고 답변을 모두 조회한다.")
    @GetMapping("/public")
    @ResponseStatus(HttpStatus.OK)
    public TimelineReviewsResponse findAllPublic(@AuthenticationPrincipal Member member,
        @RequestParam(required = false, defaultValue = DEFAULT_PAGE) Integer page,
        @RequestParam(required = false, defaultValue = DEFAULT_SIZE) Integer size,
        @RequestParam(required = false) String sort) {

        info("/api/reviews/public?page=" + page + "&size=" + size + "&sort=" + sort, "GET", "");

        Page<Review> reviews = reviewService.findAllPublic(page - 1, size, sort);

        return TimelineReviewsResponse.of(reviews, member);
    }

    @Operation(summary = "회고 답변을 수정한다.")
    @PutMapping("/{reviewId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void update(@AuthenticationPrincipal Member member, @PathVariable Long reviewId,
        @RequestBody @Valid ReviewUpdateRequest request) {

        info("/api/reviews/" + reviewId, "PUT", request.toString());

        reviewService.update(member, reviewId, request);
    }

    @Operation(summary = "회고 답변을 삭제한다.")
    @DeleteMapping("/{reviewId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@AuthenticationPrincipal Member member, @PathVariable Long reviewId) {

        info("/api/reviews/" + reviewId, "DELETE", "");

        reviewService.delete(member, reviewId);
    }
}
