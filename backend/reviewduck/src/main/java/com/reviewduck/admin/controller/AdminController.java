package com.reviewduck.admin.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.reviewduck.admin.dto.response.AdminMemberReviewsResponse;
import com.reviewduck.admin.dto.response.AdminMembersResponse;
import com.reviewduck.admin.dto.response.AdminReviewFormsResponse;
import com.reviewduck.admin.dto.response.AdminReviewResponse;
import com.reviewduck.admin.dto.response.AdminReviewsResponse;
import com.reviewduck.admin.service.AdminService;
import com.reviewduck.member.domain.Member;
import com.reviewduck.review.domain.QuestionAnswer;
import com.reviewduck.review.domain.Review;
import com.reviewduck.review.domain.ReviewForm;
import com.reviewduck.review.service.ReviewService;

import io.swagger.v3.oas.annotations.Operation;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/admin")
@AllArgsConstructor
@Slf4j
public class AdminController {
    private final AdminService adminService;
    private final ReviewService reviewService;

    @Operation(summary = "가입한 사용자를 전원 조회한다")
    @GetMapping("/members")
    @ResponseStatus(HttpStatus.OK)
    public AdminMembersResponse findAllMembers() {

        log.info("uri={}, method = {}",
            "api/admin/members", "GET");

        List<Member> members = adminService.findAllMembers();

        return AdminMembersResponse.from(members);
    }

    @Operation(summary = "사용자를 탈퇴시킨다")
    @DeleteMapping("/members/{memberId}")
    @ResponseStatus(HttpStatus.OK)
    public void deleteMember(@PathVariable Long memberId) {

        log.info("uri={}, method = {}",
            "api/admin/members/" + memberId, "DELETE");

        adminService.deleteMemberById(memberId);
    }

    @Operation(summary = "생성된 회고 폼을 모두 조회한다")
    @GetMapping("/review-forms")
    @ResponseStatus(HttpStatus.OK)
    public AdminReviewFormsResponse findAllReviewForms() {

        log.info("uri={}, method = {}",
            "api/admin/review-forms", "GET");

        List<ReviewForm> reviewForms = adminService.findAllReviewForms();

        return AdminReviewFormsResponse.from(reviewForms);
    }

    @Operation(summary = "특정 회고 폼을 기반으로 작성된 회고를 모두 조회한다")
    @GetMapping("/review-forms/{reviewFormCode}/reviews")
    @ResponseStatus(HttpStatus.OK)
    public AdminMemberReviewsResponse findMemberReviews(@PathVariable String reviewFormCode) {

        log.info("uri={}, method = {}",
            "api/admin/review-forms/" + reviewFormCode + "/reviews", "GET");

        List<Review> reviews = reviewService.findAllByCode(reviewFormCode);

        return AdminMemberReviewsResponse.from(reviews);
    }

    @Operation(summary = "회고 폼을 삭제한다")
    @DeleteMapping("/review-forms/{reviewFormId}")
    @ResponseStatus(HttpStatus.OK)
    public void deleteReviewForm(@PathVariable Long reviewFormId) {

        log.info("uri={}, method = {}",
            "api/admin/review-forms/" + reviewFormId, "DELETE");

        adminService.deleteReviewFormById(reviewFormId);
    }

    @Operation(summary = "작성된 회고를 모두 조회한다")
    @GetMapping("/reviews")
    @ResponseStatus(HttpStatus.OK)
    public AdminReviewsResponse findAllReviews() {

        log.info("uri={}, method = {}",
            "api/admin/reviews", "GET");

        List<Review> reviews = adminService.findAllReviews();

        return AdminReviewsResponse.from(reviews);
    }

    @Operation(summary = "단일 회고를 조회한다")
    @GetMapping("/reviews/{reviewId}")
    @ResponseStatus(HttpStatus.OK)
    public AdminReviewResponse findReview(@PathVariable Long reviewId) {

        log.info("uri={}, method = {}",
            "api/admin/reviews/"+reviewId, "GET");

        Review review = reviewService.findById(reviewId);

        return AdminReviewResponse.from(review);
    }

    @Operation(summary = "회고를 삭제한다")
    @DeleteMapping("/reviews/{reviewId}")
    @ResponseStatus(HttpStatus.OK)
    public void deleteReview(@PathVariable Long reviewId) {

        log.info("uri={}, method = {}",
            "api/admin/reviews/" + reviewId, "DELETE");

        adminService.deleteReviewById(reviewId);
    }
}
