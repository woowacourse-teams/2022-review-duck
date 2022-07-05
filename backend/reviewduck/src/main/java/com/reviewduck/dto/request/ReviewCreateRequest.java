package com.reviewduck.dto.request;

import java.util.List;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
@AllArgsConstructor
@Getter
public class ReviewCreateRequest {

    @NotBlank(message = "닉네임은 비어있을 수 없습니다.")
    private String nickname;

    @NotNull(message = "회고 작성 중 오류가 발생했습니다.")
    private List<AnswerRequest> answers;
}
