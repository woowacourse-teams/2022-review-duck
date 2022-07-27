package com.reviewduck.review.dto.request;

import javax.validation.constraints.NotBlank;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
@AllArgsConstructor
@Getter
@ToString
public class ReviewFormCreateFromTemplateRequest {

    @NotBlank(message = "회고 폼의 제목은 비어있을 수 없습니다.")
    private String reviewFormTitle;
}
