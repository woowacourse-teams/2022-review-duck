package com.reviewduck.admin.controller;

import static com.reviewduck.common.util.Logging.*;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.reviewduck.admin.dto.response.AdminReviewFormResponse;
import com.reviewduck.admin.dto.response.AdminReviewFormsResponse;
import com.reviewduck.admin.dto.response.AdminReviewResponse;
import com.reviewduck.admin.dto.response.AdminReviewsResponse;
import com.reviewduck.admin.service.AdminReviewFormService;
import com.reviewduck.admin.service.AdminReviewService;
import com.reviewduck.auth.exception.AuthorizationException;
import com.reviewduck.auth.support.AuthenticationPrincipal;
import com.reviewduck.common.util.Logging;
import com.reviewduck.member.domain.Member;
import com.reviewduck.review.domain.Review;
import com.reviewduck.review.domain.ReviewForm;
import com.reviewduck.review.service.ReviewFormService;
import com.reviewduck.review.service.ReviewService;

import io.swagger.v3.oas.annotations.Operation;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/admin")
@AllArgsConstructor
@Slf4j
public class AdminReviewController {

    private final AdminReviewService adminReviewService;
    private final AdminReviewFormService adminReviewFormService;
    private final ReviewFormService reviewFormService;
    private final ReviewService reviewService;

    @Operation(summary = "생성된 회고 폼을 모두 조회한다")
    @GetMapping("/review-forms")
    @ResponseStatus(HttpStatus.OK)
    public AdminReviewFormsResponse findAllReviewForms(@AuthenticationPrincipal Member member) {

        Logging.info("api/admin/review-forms", "GET", "");

        validateAdmin(member);
        List<ReviewForm> reviewForms = adminReviewFormService.findAllReviewForms();

        return AdminReviewFormsResponse.from(reviewForms);
    }

    @Operation(summary = "사용자가 작성한 회고 폼을 모두 조회한다.")
    @GetMapping(value = "/review-forms", params = "memberId")
    @ResponseStatus(HttpStatus.OK)
    public AdminReviewFormsResponse findAllReviewsByMemberId(@AuthenticationPrincipal Member member,
        @RequestParam(value = "memberId") Long memberId) {

        info("/api/review-forms?memberId=" + memberId, "GET", "");

        validateAdmin(member);
        List<ReviewForm> reviewForms = adminReviewFormService.findByMemberId(memberId);

        return AdminReviewFormsResponse.from(reviewForms);
    }

    @Operation(summary = "단일 회고 폼을 조회한다")
    @GetMapping("/review-forms/{reviewFormCode}")
    @ResponseStatus(HttpStatus.OK)
    public AdminReviewFormResponse findReviewForm(@AuthenticationPrincipal Member member,
        @PathVariable String reviewFormCode) {

        Logging.info("api/admin/review-forms/" + reviewFormCode, "GET", "");

        validateAdmin(member);
        ReviewForm reviewForm = reviewFormService.findByCode(reviewFormCode);
        List<Review> reviews = reviewService.findAllByCode(reviewFormCode);

        return AdminReviewFormResponse.of(reviewForm, reviews);
    }

    @Operation(summary = "회고 폼을 삭제한다")
    @DeleteMapping("/review-forms/{reviewFormId}")
    @ResponseStatus(HttpStatus.OK)
    public void deleteReviewForm(@AuthenticationPrincipal Member member, @PathVariable Long reviewFormId) {

        Logging.info("api/admin/review-forms/" + reviewFormId, "DELETE", "");

        validateAdmin(member);
        adminReviewFormService.deleteReviewFormById(reviewFormId);
    }

    @Operation(summary = "작성된 회고 답변을 모두 조회한다")
    @GetMapping("/reviews")
    @ResponseStatus(HttpStatus.OK)
    public AdminReviewsResponse findAllReviews(@AuthenticationPrincipal Member member) {

        Logging.info("api/admin/reviews", "GET", "");

        validateAdmin(member);
        List<Review> reviews = adminReviewService.findAllReviews();

        return AdminReviewsResponse.from(reviews);
    }

    @Operation(summary = "단일 회고 답변을 조회한다")
    @GetMapping("/reviews/{reviewId}")
    @ResponseStatus(HttpStatus.OK)
    public AdminReviewResponse findReview(@AuthenticationPrincipal Member member, @PathVariable Long reviewId) {

        Logging.info("api/admin/reviews/" + reviewId, "GET", "");

        validateAdmin(member);
        Review review = reviewService.findById(reviewId);

        return AdminReviewResponse.from(review);
    }

    @Operation(summary = "사용자가 작성한 회고 답변을 모두 조회한다.")
    @GetMapping(value = "/reviews", params = "memberId")
    @ResponseStatus(HttpStatus.OK)
    public AdminReviewsResponse findAllReviewFormsByMemberId(@AuthenticationPrincipal Member member,
        @RequestParam(value = "memberId") Long memberId) {

        info("/api/reviews?memberId=" + memberId, "GET", "");

        validateAdmin(member);
        List<Review> reviews = adminReviewService.findByMemberId(memberId);

        return AdminReviewsResponse.from(reviews);
    }

    @Operation(summary = "회고 답변을 삭제한다")
    @DeleteMapping("/reviews/{reviewId}")
    @ResponseStatus(HttpStatus.OK)
    public void deleteReview(@AuthenticationPrincipal Member member, @PathVariable Long reviewId) {

        Logging.info("api/admin/reviews/" + reviewId, "DELETE", "");

        validateAdmin(member);
        adminReviewService.deleteReviewById(reviewId);
    }

    private void validateAdmin(Member member) {
        if (!member.isAdmin()) {
            throw new AuthorizationException("어드민 권한이 없습니다.");
        }
    }
}
