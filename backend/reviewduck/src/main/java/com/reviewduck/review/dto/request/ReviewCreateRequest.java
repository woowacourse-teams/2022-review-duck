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
public class ReviewCreateRequest {

    @NotNull(message = "공개 여부를 설정해야 합니다.")
    private boolean isPrivate;

    @NotNull(message = "회고 내용은 비어있을 수 없습니다.")
    @Valid
    private List<ReviewContentCreateRequest> contents;

    public boolean getIsPrivate() {
        return isPrivate;
    }
}
