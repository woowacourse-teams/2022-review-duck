package com.reviewduck.review.dto.request;

import java.util.List;

import javax.validation.Valid;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Positive;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
@AllArgsConstructor
@Getter
public class ReviewLikesRequest {

    @NotNull(message = "좋아요 요청 중 오류가 발생했습니다.")
    private Long id;

    @Min(value = 0, message = "좋아요 개수는 0 이상이어야 합니다.")
    private int likes;

    @Override
    public String toString() {
        return "ReviewLikesRequest{" +
            "id=" + id +
            ", likes=" + likes +
            '}';
    }
}
