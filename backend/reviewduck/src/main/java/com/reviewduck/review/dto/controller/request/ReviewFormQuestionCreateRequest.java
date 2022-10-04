package com.reviewduck.review.dto.controller.request;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
@AllArgsConstructor
@Getter
@ToString
public class ReviewFormQuestionCreateRequest {

    @NotBlank(message = "회고 폼의 질문은 비어있을 수 없습니다.")
    private String value;

    @NotNull(message = "회고 폼의 질문 설명 생성시 문제가 발생했습니다.")
    private String description;
}
