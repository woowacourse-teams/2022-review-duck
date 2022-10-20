package com.reviewduck.admin.controller;

import static com.reviewduck.common.util.Logging.*;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.reviewduck.admin.dto.AdminMemberDto;
import com.reviewduck.admin.dto.response.AdminReviewFormResponse;
import com.reviewduck.admin.dto.response.AdminReviewFormsResponse;
import com.reviewduck.admin.dto.response.AdminReviewResponse;
import com.reviewduck.admin.dto.response.AdminReviewsResponse;
import com.reviewduck.admin.service.AdminReviewAggregator;
import com.reviewduck.auth.exception.AuthorizationException;
import com.reviewduck.auth.support.AdminAuthenticationPrincipal;
import com.reviewduck.common.util.Logging;

import io.swagger.v3.oas.annotations.Operation;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/admin")
@AllArgsConstructor
@Slf4j
public class AdminReviewController {

    private final AdminReviewAggregator adminReviewAggregator;

    @Operation(summary = "생성된 회고 폼을 모두 조회한다")
    @GetMapping("/review-forms")
    @ResponseStatus(HttpStatus.OK)
    public AdminReviewFormsResponse findAllReviewForms(@AdminAuthenticationPrincipal AdminMemberDto member) {

        Logging.info("api/admin/review-forms", "GET", "");

        validateAdmin(member);
        return adminReviewAggregator.findAllReviewForms();
    }

    @Operation(summary = "사용자가 작성한 회고 폼을 모두 조회한다.")
    @GetMapping(value = "/review-forms", params = "memberId")
    @ResponseStatus(HttpStatus.OK)
    public AdminReviewFormsResponse findAllReviewFormsByMemberId(@AdminAuthenticationPrincipal AdminMemberDto member,
        @RequestParam(value = "memberId") long memberId) {

        info("/api/review-forms?memberId=" + memberId, "GET", "");

        validateAdmin(member);
        return adminReviewAggregator.findReviewFormsByMemberId(memberId);
    }

    @Operation(summary = "단일 회고 폼을 조회한다")
    @GetMapping("/review-forms/{reviewFormCode}")
    @ResponseStatus(HttpStatus.OK)
    public AdminReviewFormResponse findReviewForm(@AdminAuthenticationPrincipal AdminMemberDto member,
        @PathVariable String reviewFormCode) {

        Logging.info("api/admin/review-forms/" + reviewFormCode, "GET", "");

        validateAdmin(member);
        return adminReviewAggregator.findReviewFormByCode(reviewFormCode);
    }

    @Operation(summary = "회고 폼을 삭제한다")
    @DeleteMapping("/review-forms/{reviewFormId}")
    @ResponseStatus(HttpStatus.OK)
    public void deleteReviewForm(@AdminAuthenticationPrincipal AdminMemberDto member, @PathVariable long reviewFormId) {

        Logging.info("api/admin/review-forms/" + reviewFormId, "DELETE", "");

        validateAdmin(member);
        adminReviewAggregator.deleteReviewFormById(reviewFormId);
    }

    @Operation(summary = "작성된 회고 답변을 모두 조회한다")
    @GetMapping("/reviews")
    @ResponseStatus(HttpStatus.OK)
    public AdminReviewsResponse findAllReviews(@AdminAuthenticationPrincipal AdminMemberDto member) {

        Logging.info("api/admin/reviews", "GET", "");

        validateAdmin(member);
        return adminReviewAggregator.findAllReviews();
    }

    @Operation(summary = "단일 회고 답변을 조회한다")
    @GetMapping("/reviews/{reviewId}")
    @ResponseStatus(HttpStatus.OK)
    public AdminReviewResponse findReview(@AdminAuthenticationPrincipal AdminMemberDto member,
        @PathVariable Long reviewId) {

        Logging.info("api/admin/reviews/" + reviewId, "GET", "");

        validateAdmin(member);
        return adminReviewAggregator.findReviewByReviewId(reviewId);
    }

    @Operation(summary = "사용자가 작성한 회고 답변을 모두 조회한다.")
    @GetMapping(value = "/reviews", params = "memberId")
    @ResponseStatus(HttpStatus.OK)
    public AdminReviewsResponse findAllReviewsByMemberId(@AdminAuthenticationPrincipal AdminMemberDto member,
        @RequestParam(value = "memberId") Long memberId) {

        info("/api/reviews?memberId=" + memberId, "GET", "");

        validateAdmin(member);
        return adminReviewAggregator.findAllReviewsByMemberId(memberId);
    }

    @Operation(summary = "회고 답변을 삭제한다")
    @DeleteMapping("/reviews/{reviewId}")
    @ResponseStatus(HttpStatus.OK)
    public void deleteReview(@AdminAuthenticationPrincipal AdminMemberDto member, @PathVariable Long reviewId) {

        Logging.info("api/admin/reviews/" + reviewId, "DELETE", "");

        validateAdmin(member);
        adminReviewAggregator.deleteReviewById(reviewId);
    }

    private void validateAdmin(AdminMemberDto member) {
        if (!member.getIsAdmin()) {
            throw new AuthorizationException("어드민 권한이 없습니다.");
        }
    }
}
