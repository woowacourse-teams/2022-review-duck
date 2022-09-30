package com.reviewduck.review.service;

import java.util.List;
import java.util.stream.Collectors;

import com.reviewduck.review.dto.request.ReviewFormQuestionCreateRequest;
import com.reviewduck.review.dto.request.ReviewFormQuestionUpdateRequest;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class ServiceDtoConverter {

    public static List<ReviewFormQuestionCreateDto> toReviewFormQuestionCreateDtos(
        List<ReviewFormQuestionCreateRequest> questions) {
        return questions.stream()
            .map(dto -> new ReviewFormQuestionCreateDto(dto.getValue(), dto.getDescription()))
            .collect(Collectors.toUnmodifiableList());
    }

    public static List<ReviewFormQuestionUpdateDto> toReviewFormQuestionUpdateDtos(
        List<ReviewFormQuestionUpdateRequest> questions) {
        return questions.stream()
            .map(dto -> new ReviewFormQuestionUpdateDto(dto.getId(), dto.getValue(), dto.getDescription()))
            .collect(Collectors.toUnmodifiableList());
    }
}
