package com.reviewduck.admin.controller;

import static com.reviewduck.common.util.Logging.*;

import java.util.List;
import java.util.Objects;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletResponse;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.web.bind.annotation.CookieValue;
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
import com.reviewduck.auth.dto.response.TokenResponse;
import com.reviewduck.auth.dto.service.TokensDto;
import com.reviewduck.auth.exception.AuthorizationException;
import com.reviewduck.auth.service.AuthService;
import com.reviewduck.auth.support.AuthenticationPrincipal;
import com.reviewduck.member.domain.Member;
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

    private static final int SEVEN_DAYS = 7 * 24 * 60 * 60;

    private final AdminService adminService;
    private final AuthService authService;
    private final ReviewService reviewService;
    
    @Operation(summary = "어드민 페이지에 로그인한다.")
    @GetMapping("/login")
    @ResponseStatus(HttpStatus.OK)
    public TokenResponse loginAdmin(@CookieValue(value = "refreshToken", required = false) Cookie cookie,
        HttpServletResponse response){

        info("/api/admin/login", "GET", "");

        validateCookie(cookie);

        String refreshToken = cookie.getValue();
        TokensDto tokensDto = authService.regenerateTokens(refreshToken);

        ResponseCookie refreshTokenCookie = createRefreshTokenCookie(tokensDto.getRefreshToken(), SEVEN_DAYS);
        response.setHeader("Set-Cookie", refreshTokenCookie.toString());

        return new TokenResponse(tokensDto.getAccessToken());
    }

    private void validateCookie(Cookie cookie) {
        if (Objects.isNull(cookie)) {
            throw new AuthorizationException("리프레시 토큰이 없습니다.");
        }
    }

    private ResponseCookie createRefreshTokenCookie(String value, int maxAge) {
        return ResponseCookie.from("refreshToken", value)
            .maxAge(maxAge)
            .path("/")
            .secure(true)
            .sameSite("None")
            .httpOnly(true)
            .build();
    }

    @Operation(summary = "가입한 사용자를 전원 조회한다")
    @GetMapping("/members")
    @ResponseStatus(HttpStatus.OK)
    public AdminMembersResponse findAllMembers(@AuthenticationPrincipal Member member) {

        log.info("uri={}, method = {}",
            "api/admin/members", "GET");

        validateAdmin(member);
        List<Member> members = adminService.findAllMembers();

        return AdminMembersResponse.from(members);
    }

    @Operation(summary = "사용자를 탈퇴시킨다")
    @DeleteMapping("/members/{memberId}")
    @ResponseStatus(HttpStatus.OK)
    public void deleteMember(@AuthenticationPrincipal Member member, @PathVariable Long memberId) {

        log.info("uri={}, method = {}",
            "api/admin/members/" + memberId, "DELETE");

        validateAdmin(member);
        adminService.deleteMemberById(memberId);
    }

    @Operation(summary = "생성된 회고 폼을 모두 조회한다")
    @GetMapping("/review-forms")
    @ResponseStatus(HttpStatus.OK)
    public AdminReviewFormsResponse findAllReviewForms(@AuthenticationPrincipal Member member) {

        log.info("uri={}, method = {}",
            "api/admin/review-forms", "GET");

        validateAdmin(member);
        List<ReviewForm> reviewForms = adminService.findAllReviewForms();

        return AdminReviewFormsResponse.from(reviewForms);
    }

    @Operation(summary = "특정 회고 폼을 기반으로 작성된 회고를 모두 조회한다")
    @GetMapping("/review-forms/{reviewFormCode}/reviews")
    @ResponseStatus(HttpStatus.OK)
    public AdminMemberReviewsResponse findMemberReviews(@AuthenticationPrincipal Member member, @PathVariable String reviewFormCode) {

        log.info("uri={}, method = {}",
            "api/admin/review-forms/" + reviewFormCode + "/reviews", "GET");

        validateAdmin(member);
        List<Review> reviews = reviewService.findAllByCode(reviewFormCode);

        return AdminMemberReviewsResponse.from(reviews);
    }

    @Operation(summary = "회고 폼을 삭제한다")
    @DeleteMapping("/review-forms/{reviewFormId}")
    @ResponseStatus(HttpStatus.OK)
    public void deleteReviewForm(@AuthenticationPrincipal Member member, @PathVariable Long reviewFormId) {

        log.info("uri={}, method = {}",
            "api/admin/review-forms/" + reviewFormId, "DELETE");

        validateAdmin(member);
        adminService.deleteReviewFormById(reviewFormId);
    }

    @Operation(summary = "작성된 회고를 모두 조회한다")
    @GetMapping("/reviews")
    @ResponseStatus(HttpStatus.OK)
    public AdminReviewsResponse findAllReviews(@AuthenticationPrincipal Member member) {

        log.info("uri={}, method = {}",
            "api/admin/reviews", "GET");

        validateAdmin(member);
        List<Review> reviews = adminService.findAllReviews();

        return AdminReviewsResponse.from(reviews);
    }

    @Operation(summary = "단일 회고를 조회한다")
    @GetMapping("/reviews/{reviewId}")
    @ResponseStatus(HttpStatus.OK)
    public AdminReviewResponse findReview(@AuthenticationPrincipal Member member, @PathVariable Long reviewId) {

        log.info("uri={}, method = {}",
            "api/admin/reviews/"+reviewId, "GET");

        validateAdmin(member);
        Review review = reviewService.findById(reviewId);

        return AdminReviewResponse.from(review);
    }

    @Operation(summary = "회고를 삭제한다")
    @DeleteMapping("/reviews/{reviewId}")
    @ResponseStatus(HttpStatus.OK)
    public void deleteReview(@AuthenticationPrincipal Member member, @PathVariable Long reviewId) {

        log.info("uri={}, method = {}",
            "api/admin/reviews/" + reviewId, "DELETE");

        validateAdmin(member);
        adminService.deleteReviewById(reviewId);
    }

    private void validateAdmin(Member member) {
        if(!member.isAdmin()){
            throw new AuthorizationException("어드민 권한이 없습니다.");
        }
    }
}
