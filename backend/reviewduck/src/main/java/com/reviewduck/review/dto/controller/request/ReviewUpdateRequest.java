package com.reviewduck.review.dto.controller.request;

import java.util.List;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class ReviewUpdateRequest {

    @NotNull(message = "공개 여부를 설정해야 합니다.")
    private Boolean isPrivate;

    @NotNull(message = "회고 제목은 비어있을 수 없습니다.")
    private String title;

    @NotNull(message = "회고 답변 관련 오류가 발생했습니다.")
    @Valid
    private List<ReviewContentUpdateRequest> contents;

    public Boolean getIsPrivate() {
        return isPrivate;
    }

    public ReviewUpdateRequest(Boolean isPrivate, String title, List<ReviewContentUpdateRequest> contents) {
        this.isPrivate = isPrivate;
        this.title = title;
        this.contents = contents;
    }
}
