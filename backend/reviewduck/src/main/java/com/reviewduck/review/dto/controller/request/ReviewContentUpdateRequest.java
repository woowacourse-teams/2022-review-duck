package com.reviewduck.review.dto.controller.request;

import javax.validation.Valid;
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
public class ReviewContentUpdateRequest {

    @NotNull(message = "질문 번호는 비어있을 수 없습니다.")
    private Long questionId;

    @NotNull(message = "회고 답변 생성 중 오류가 발생했습니다.")
    @Valid
    private AnswerUpdateRequest answer;
}
