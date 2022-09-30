package com.reviewduck.review.domain;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

import org.hibernate.annotations.SQLDelete;

import com.reviewduck.review.exception.ReviewFormQuestionException;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@SQLDelete(sql = "update review_form_question set review_form_id = null where id=?")
public class ReviewFormQuestion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false)
    private Long id;

    @Column(name = "question_value", nullable = false)
    private String value = "";

    @Column(nullable = false)
    private String description;

    @Column(nullable = false)
    private int position = -1;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "review_form_id")
    private ReviewForm reviewForm;

    public ReviewFormQuestion(String value, String description) {
        validateValue(value);
        validateDescription(description);

        this.value = value;
        this.description = description;
    }

    public ReviewFormQuestion(String value, String description, ReviewForm reviewForm) {
        validateValue(value);
        validateDescription(description);

        this.value = value;
        this.description = description;
        this.reviewForm = reviewForm;
    }

    public void update(String value, String description) {
        validateValue(value);
        validateDescription(description);

        this.value = value;
        this.description = description;
    }

    public void setPosition(int position) {
        validatePosition(position);
        this.position = position;
    }

    private void validateValue(String value) {
        validateNull(value);
        validateBlank(value);
        validateLength(value);
    }

    private void validateDescription(String description) {
        validateNull(description);
    }

    private void validateNull(String value) {
        if (value == null) {
            throw new ReviewFormQuestionException("질문 생성 중 에러가 발생하였습니다.");
        }
    }

    private void validateBlank(String value) {
        if (value.isBlank()) {
            throw new ReviewFormQuestionException("질문 내용은 비어있을 수 없습니다.");
        }
    }

    private void validateLength(String value) {
        if (value.length() > 200) {
            throw new ReviewFormQuestionException("질문은 200자를 넘을 수 없습니다.");
        }
    }

    private void validatePosition(int position) {
        if (position < 0) {
            throw new ReviewFormQuestionException("질문 생성 중 에러가 발생하였습니다.");
        }
    }
}
