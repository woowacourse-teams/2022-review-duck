package com.reviewduck.review.controller;

import javax.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.reviewduck.review.dto.request.ReviewRequest;
import com.reviewduck.review.service.ReviewService;

import io.swagger.v3.oas.annotations.Operation;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/reviews")
@AllArgsConstructor
@Slf4j
public class ReviewController {

	private final ReviewService reviewService;

	@Operation(summary = "회고 답변을 수정한다.")
	@PutMapping("/{reviewId}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	public void update(@PathVariable Long reviewId, @RequestBody @Valid ReviewRequest request) {

		log.info("uri={}, method = {}, request = {}",
			"/api/reviews/" + reviewId, "PUT", request.toString());

		reviewService.update(reviewId, request);
	}

	@Operation(summary = "회고 답변을 삭제한다.")
	@DeleteMapping("/{reviewId}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	public void delete(@PathVariable Long reviewId) {

		log.info("uri={}, method = {}, request = {}",
			"/api/reviews/" + reviewId, "DELETE", "");

		reviewService.delete(reviewId);
	}
}
