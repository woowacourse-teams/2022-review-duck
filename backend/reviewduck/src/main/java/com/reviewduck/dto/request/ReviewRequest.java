package com.reviewduck.dto.request;

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
public class ReviewRequest {

    @NotBlank(message = "닉네임은 비어있을 수 없습니다.")
    private String nickname;

    @NotNull(message = "답변 목록은 비어있을 수 없습니다.")
    @Valid
    private List<AnswerRequest> answers;
}
