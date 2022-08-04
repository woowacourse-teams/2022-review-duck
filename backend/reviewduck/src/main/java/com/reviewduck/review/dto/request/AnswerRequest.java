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
public class AnswerRequest {

    @NotNull(message = "질문 번호는 비어있을 수 없습니다.")
    private Long questionId;

    @NotNull(message = "답변은 비어있을 수 없습니다.")
    private String answerValue;
}
