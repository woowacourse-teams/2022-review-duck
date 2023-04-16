package com.reviewduck.review.dto.controller.request;

import lombok.*;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
@AllArgsConstructor
@Getter
@ToString
public class ReviewCommentCreateRequest {
    @NotNull(message = "댓글은 비어있을 수 없습니다.")
    @Valid
    private String content;
}
