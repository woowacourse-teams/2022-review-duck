package com.reviewduck.template.dto.controller.request;

import javax.validation.constraints.NotNull;

import com.reviewduck.template.dto.service.TemplateQuestionCreateDto;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
@AllArgsConstructor
@Getter
@ToString
public class TemplateQuestionCreateRequest {

    @NotNull(message = "템플릿의 질문 목록 생성 중 오류가 발생했습니다.")
    private String value;

    @NotNull(message = "템플릿의 질문 설명 생성 중 오류가 발생했습니다.")
    private String description;

    public TemplateQuestionCreateDto toServiceDto() {
        return new TemplateQuestionCreateDto(value, description);
    }
}
