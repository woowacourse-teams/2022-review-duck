package com.reviewduck.admin.controller;

import static com.reviewduck.common.util.Logging.*;

import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.reviewduck.admin.dto.AdminMemberDto;
import com.reviewduck.admin.dto.response.AdminReviewResponse;
import com.reviewduck.admin.dto.response.AdminReviewsResponse;
import com.reviewduck.admin.service.AdminReviewService;
import com.reviewduck.auth.support.AdminAuthenticationPrincipal;
import com.reviewduck.common.util.Logging;

import io.swagger.v3.oas.annotations.Operation;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/admin")
@AllArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class AdminReviewController {

    private final AdminReviewService adminReviewService;

    @Operation(summary = "작성된 회고 답변을 모두 조회한다")
    @GetMapping("/reviews")
    @ResponseStatus(HttpStatus.OK)
    public AdminReviewsResponse findAllReviews(@AdminAuthenticationPrincipal AdminMemberDto member) {

        Logging.info("api/admin/reviews", "GET", "");

        return adminReviewService.findAllReviews();
    }

    @Operation(summary = "단일 회고 답변을 조회한다")
    @GetMapping("/reviews/{reviewId}")
    @ResponseStatus(HttpStatus.OK)
    public AdminReviewResponse findReview(@AdminAuthenticationPrincipal AdminMemberDto member,
        @PathVariable long reviewId) {

        Logging.info("api/admin/reviews/" + reviewId, "GET", "");

        return adminReviewService.findReview(reviewId);
    }

    @Operation(summary = "사용자가 작성한 회고 답변을 모두 조회한다.")
    @GetMapping(value = "/reviews", params = "memberId")
    @ResponseStatus(HttpStatus.OK)
    public AdminReviewsResponse findMemberReviews(@AdminAuthenticationPrincipal AdminMemberDto member,
        @RequestParam(value = "memberId") long memberId) {

        info("/api/reviews?memberId=" + memberId, "GET", "");

        return adminReviewService.findMemberReviews(memberId);
    }

    @Transactional
    @Operation(summary = "회고 답변을 삭제한다")
    @DeleteMapping("/reviews/{reviewId}")
    @ResponseStatus(HttpStatus.OK)
    public void deleteReview(@AdminAuthenticationPrincipal AdminMemberDto member, @PathVariable long reviewId) {

        Logging.info("api/admin/reviews/" + reviewId, "DELETE", "");

        adminReviewService.deleteReview(reviewId);
    }
}
