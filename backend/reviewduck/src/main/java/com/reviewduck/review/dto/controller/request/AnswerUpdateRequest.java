package com.reviewduck.review.dto.controller.request;

import javax.validation.constraints.NotNull;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
@AllArgsConstructor
@Getter
public class AnswerUpdateRequest {

    private Long id;

    @NotNull(message = "답변은 비어있을 수 없습니다.")
    private String value;
}
