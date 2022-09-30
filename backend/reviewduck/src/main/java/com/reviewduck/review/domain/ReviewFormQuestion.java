package com.reviewduck.review.domain;

import java.util.Objects;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

import org.hibernate.Hibernate;

import com.reviewduck.review.exception.ReviewFormQuestionException;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
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

    public ReviewFormQuestion(String value, String description) {
        validateValue(value);
        validateDescription(description);

        this.value = value;
        this.description = description;
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
        if (Objects.isNull(value)) {
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

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o))
            return false;
        ReviewFormQuestion that = (ReviewFormQuestion)o;
        return id!= null && Objects.equals(id, that.getId());
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}
