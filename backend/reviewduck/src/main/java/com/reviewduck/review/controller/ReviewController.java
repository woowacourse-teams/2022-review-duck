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
import com.reviewduck.member.dto.response.MemberDto;
import com.reviewduck.review.dto.controller.request.ReviewLikesRequest;
import com.reviewduck.review.dto.controller.request.ReviewUpdateRequest;
import com.reviewduck.review.dto.controller.response.ReviewEditResponse;
import com.reviewduck.review.dto.controller.response.ReviewLikesResponse;
import com.reviewduck.review.dto.controller.response.ReviewsResponse;
import com.reviewduck.review.dto.controller.response.TimelineReviewsResponse;
import com.reviewduck.review.service.ReviewResponseMapper;
import com.reviewduck.review.service.ReviewService;

import io.swagger.v3.oas.annotations.Operation;
import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/api/reviews")
@AllArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;
    private final ReviewResponseMapper responseMapper;

    @Operation(summary = "회고 답변 수정을 위해 특정한 회고 답변을 조회한다.")
    @GetMapping("/{reviewId}")
    @ResponseStatus(HttpStatus.OK)
    public ReviewEditResponse findById(@AuthenticationPrincipal MemberDto member, @PathVariable Long reviewId) {

        info("/api/reviews/" + reviewId, "GET", "");

        return responseMapper.findEditedById(reviewId);
    }

    @Operation(summary = "사용자가 작성한 회고 답변을 모두 조회한다.")
    @GetMapping(params = "member")
    @ResponseStatus(HttpStatus.OK)
    public ReviewsResponse findBySocialId(@AuthenticationPrincipal MemberDto member,
        @RequestParam(value = "member") String socialId,
        @RequestParam(required = false, defaultValue = DEFAULT_PAGE) int page,
        @RequestParam(required = false, defaultValue = DEFAULT_SIZE) int size
    ) {

        info("/api/reviews?member=" + socialId + "&page=" + page + "&size=" + size, "GET", "");

        return responseMapper.findAllBySocialId(socialId, member.getId(), page - 1, size);
    }

    @Operation(summary = "비밀글이 아닌 회고 답변을 모두 조회한다.")
    @GetMapping("/public")
    @ResponseStatus(HttpStatus.OK)
    public TimelineReviewsResponse findAllPublic(@AuthenticationPrincipal MemberDto member,
        @RequestParam(required = false, defaultValue = DEFAULT_PAGE) int page,
        @RequestParam(required = false, defaultValue = DEFAULT_SIZE) int size,
        @RequestParam(required = false, defaultValue = "latest") String sort) {

        info("/api/reviews/public?page=" + page + "&size=" + size + "&sort=" + sort, "GET", "");

        return responseMapper.findAllPublic(page - 1, size, sort, member);
    }

    @Operation(summary = "회고 답변을 수정한다.")
    @PutMapping("/{reviewId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void update(@AuthenticationPrincipal MemberDto member, @PathVariable Long reviewId,
        @RequestBody @Valid ReviewUpdateRequest request) {

        info("/api/reviews/" + reviewId, "PUT", request.toString());

        reviewService.update(member.getId(), reviewId, request);
    }

    @Operation(summary = "회고 답변을 삭제한다.")
    @DeleteMapping("/{reviewId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@AuthenticationPrincipal MemberDto member, @PathVariable Long reviewId) {

        info("/api/reviews/" + reviewId, "DELETE", "");

        reviewService.delete(member.getId(), reviewId);
    }

    @Operation(summary = "좋아요 개수를 더한다.")
    @PostMapping("/{reviewId}/likes")
    @ResponseStatus(HttpStatus.OK)
    public ReviewLikesResponse likes(@PathVariable Long reviewId, @RequestBody @Valid ReviewLikesRequest request) {

        info("/api/reviews/" + reviewId + "/likes", "POST", request.toString());

        int likes = reviewService.increaseLikes(reviewId, request.getLikes());
        return new ReviewLikesResponse(likes);
    }
}
