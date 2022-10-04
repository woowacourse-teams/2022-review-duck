package com.reviewduck.review.dto.controller.request;

import javax.validation.constraints.Min;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
@AllArgsConstructor
@Getter
@ToString
public class ReviewLikesRequest {

    @Min(value = 0, message = "좋아요 개수는 0 이상이어야 합니다.")
    private int likes;

}
