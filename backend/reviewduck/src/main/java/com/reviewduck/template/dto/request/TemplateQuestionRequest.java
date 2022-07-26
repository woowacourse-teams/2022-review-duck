package com.reviewduck.template.dto.request;

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
public class TemplateQuestionRequest {

    @NotNull(message = "템플릿의 질문 목록 생성 중 오류가 발생했습니다.")
    private String questionValue;
}
