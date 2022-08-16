package com.reviewduck.review.dto.response;

import java.sql.Timestamp;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import com.reviewduck.member.domain.Member;
import com.reviewduck.review.domain.Answer;
import com.reviewduck.review.domain.QuestionAnswer;
import com.reviewduck.review.domain.Review;
import com.reviewduck.review.domain.ReviewForm;
import com.reviewduck.review.domain.ReviewFormQuestion;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class ReviewSheetResponse {

    private Long id;
    private String reviewTitle;
    private long updatedAt;
    private boolean isCreator;
    private CreatorResponse creator;
    private List<ReviewContentResponse> contents;

    public static ReviewSheetResponse of(Member member, Review review) {
        ReviewForm reviewForm = review.getReviewForm();

        Map<ReviewFormQuestion, Answer> reviewMap = review.getQuestionAnswers().stream()
            .collect(Collectors.toUnmodifiableMap(QuestionAnswer::getReviewFormQuestion, QuestionAnswer::getAnswer));

        List<ReviewContentResponse> contents = reviewForm.getReviewFormQuestions().stream()
            .map(question -> ReviewContentResponse.of(question, reviewMap.getOrDefault(question, null)))
            .collect(Collectors.toUnmodifiableList());

        return new ReviewSheetResponse(
            review.getId(),
            review.getTitle(),
            Timestamp.valueOf(review.getUpdatedAt()).getTime(),
            review.isMine(member),
            CreatorResponse.from(review.getMember()),
            contents
        );
    }

    public boolean getIsCreator() {
        return isCreator;
    }
}
