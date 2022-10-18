package com.reviewduck.review.dto.service;

import java.time.LocalDateTime;
import java.util.List;

import com.reviewduck.member.domain.Member;
import com.reviewduck.review.domain.QuestionAnswer;
import com.reviewduck.review.domain.Review;
import com.reviewduck.review.domain.ReviewForm;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class ReviewDto {

    private final Long id;
    private final String title;
    private final Member member;
    private final ReviewForm reviewForm;
    private final boolean isPrivate;
    private final int likes;
    private final List<QuestionAnswer> questionAnswers;
    private final LocalDateTime createdAt;
    private final LocalDateTime updatedAt;

    public static ReviewDto from(Review review) {
        return new ReviewDto(review.getId(), review.getTitle(), review.getMember(),
        review.getReviewForm(), review.isPrivate(), review.getLikes(),
            review.getQuestionAnswers(), review.getCreatedAt(), review.getUpdatedAt());
    }
}
