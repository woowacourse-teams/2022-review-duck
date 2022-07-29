package com.reviewduck.review.dto.request;

import java.util.List;

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
public class ReviewRequest {

    @NotNull(message = "회고 답변 관련 오류가 발생했습니다.")
    @Valid
    private List<AnswerRequest> answers;
}
