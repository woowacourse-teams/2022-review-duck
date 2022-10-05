package com.reviewduck.review.service;

import java.util.List;
import java.util.stream.Collectors;

import com.reviewduck.review.dto.controller.request.ReviewFormQuestionCreateRequest;
import com.reviewduck.review.dto.controller.request.ReviewFormQuestionUpdateRequest;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class ServiceDtoConverter {

    public static List<ReviewFormQuestionCreateDto> toReviewFormQuestionCreateDtos(
        List<ReviewFormQuestionCreateRequest> questions) {
        return questions.stream()
            .map(request -> new ReviewFormQuestionCreateDto(request.getValue(), request.getDescription()))
            .collect(Collectors.toUnmodifiableList());
    }

    public static List<ReviewFormQuestionUpdateDto> toReviewFormQuestionUpdateDtos(
        List<ReviewFormQuestionUpdateRequest> questions) {
        return questions.stream()
            .map(request -> new ReviewFormQuestionUpdateDto(request.getId(), request.getValue(), request.getDescription()))
            .collect(Collectors.toUnmodifiableList());
    }
}
