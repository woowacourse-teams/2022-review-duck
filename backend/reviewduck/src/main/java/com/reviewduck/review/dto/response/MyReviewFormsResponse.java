package com.reviewduck.review.dto.response;

import java.util.List;
import java.util.stream.Collectors;

import com.reviewduck.review.domain.ReviewForm;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class MyReviewFormsResponse {
    private int numberOfReviewForms;
    private List<MyReviewFormResponse> reviewForms;

    public static MyReviewFormsResponse from(List<ReviewForm> reviewForms) {
        List<MyReviewFormResponse> reviewFormResponses = reviewForms.stream()
            .map(MyReviewFormResponse::from)
            .collect(Collectors.toList());

        return new MyReviewFormsResponse(reviewForms.size(), reviewFormResponses);
    }
}
