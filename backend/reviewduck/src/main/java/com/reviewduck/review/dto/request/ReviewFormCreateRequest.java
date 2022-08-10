package com.reviewduck.review.dto.request;

import java.util.List;

import javax.validation.Valid;
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
public class ReviewFormCreateRequest {

    @NotBlank(message = "회고 폼의 제목은 비어있을 수 없습니다.")
    private String reviewFormTitle;

    @NotNull(message = "회고 폼의 질문 목록 생성 중 오류가 발생했습니다.")
    @Valid
    private List<ReviewFormQuestionCreateRequest> questions;

}
