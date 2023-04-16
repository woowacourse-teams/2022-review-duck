package com.reviewduck.review.controller;

import com.reviewduck.auth.support.AuthenticationPrincipal;
import com.reviewduck.member.dto.MemberDto;
import com.reviewduck.review.dto.controller.request.ReviewCommentCreateRequest;
import com.reviewduck.review.dto.controller.request.ReviewCreateRequest;
import com.reviewduck.review.dto.controller.response.ReviewCommentsResponse;
import com.reviewduck.review.service.ReviewCommentService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

import static com.reviewduck.common.util.Logging.info;
import static com.reviewduck.common.vo.PageConstant.DEFAULT_PAGE;
import static com.reviewduck.common.vo.PageConstant.DEFAULT_SIZE;

@RestController
@RequestMapping("/api/reviews")
@AllArgsConstructor
public class ReviewCommentController {

    private final ReviewCommentService reviewCommentService;

    @Operation(summary = "회고에 달린 댓글을 조회한다.")
    @GetMapping("/{reviewId}/comments")
    @ResponseStatus(HttpStatus.OK)
    public ReviewCommentsResponse findAll(
            @PathVariable long reviewId,
            @RequestParam(required = false, defaultValue = DEFAULT_PAGE) int page,
            @RequestParam(required = false, defaultValue = DEFAULT_SIZE) int size
    ) {
        info("/api/reviews/" + reviewId + "comments" + "&page=" + page + "&size=" + size, "GET", "");

        return reviewCommentService.findAll(reviewId, page - 1, size);
    }

    @Operation(summary = "회고에 댓글을 생성한다.")
    @PostMapping("/{reviewId}/comments")
    @ResponseStatus(HttpStatus.CREATED)
    public void createComment(@AuthenticationPrincipal MemberDto member, @PathVariable long reviewId,
                              @RequestBody @Valid ReviewCommentCreateRequest request) {

        info("/api/reviews/{reviewId}/comments", "POST", request.toString());

        reviewCommentService.save(member.getId(), reviewId, request);
    }
}
