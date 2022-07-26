package com.reviewduck.review.dto.request;

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
public class ReviewFormQuestionRequest {

    @NotNull(message = "회고 폼의 질문 목록 생성 중 오류가 발생했습니다.")
    private String questionValue;
}
