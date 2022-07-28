package com.reviewduck.review.dto.response;

import java.sql.Timestamp;
import java.util.List;
import java.util.stream.Collectors;

import com.reviewduck.review.domain.Review;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class MyReviewResponse {
    private Long reviewId;
    private long updatedAt;
    private List<AnswerResponse> answers;
    private MyReviewReviewFormResponse reviewForm;

    public static MyReviewResponse of(Review review) {
        List<AnswerResponse> answers = review.getQuestionAnswers().stream()
            .map(
                questionAnswer -> AnswerResponse.of(questionAnswer.getReviewFormQuestion(), questionAnswer.getAnswer()))
            .collect(Collectors.toUnmodifiableList());

        long updatedAt = Timestamp.valueOf(review.getUpdatedAt()).getTime();
        MyReviewReviewFormResponse reviewForm = MyReviewReviewFormResponse.from(review.getReviewForm());
        return new MyReviewResponse(review.getId(), updatedAt, answers, reviewForm);
    }
}
