package com.reviewduck.domain;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;

import org.apache.commons.lang3.RandomStringUtils;

import com.reviewduck.exception.ReviewFormException;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
public class ReviewForm {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false)
    private Long id;

    @Column(name = "code", nullable = false, updatable = false)
    private String code;

    @Column(nullable = false)
    private String reviewTitle;

    @OneToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinColumn(name = "question_id")
    private List<Question> questions;

    public ReviewForm(String reviewTitle, List<String> questionValues) {
        validate(reviewTitle, questionValues);
        this.reviewTitle = reviewTitle;
        this.questions = setQuestions(questionValues);
        this.code = RandomStringUtils.randomAlphanumeric(8).toUpperCase();
    }

    private List<Question> setQuestions(List<String> questionValues) {
        List<Question> questions = questionValues.stream()
            .map(Question::new)
            .collect(Collectors.toUnmodifiableList());
        orderQuestions(questions);
        return questions;
    }

    private void orderQuestions(List<Question> questions) {
        int index = 0;
        for (Question question : questions) {
            question.setPosition(index++);
        }
    }

    public void update(String reviewTitle, List<Question> questions) {
        validateTitleLength(reviewTitle);
        validateBlankTitle(reviewTitle);
        this.reviewTitle = reviewTitle;
        orderQuestions(questions);
        this.questions = questions;
    }

    private void validate(String reviewTitle, List<String> questionValues) {
        validateBlankTitle(reviewTitle);
        validateTitleLength(reviewTitle);
        validateNullQuestions(questionValues);
    }

    private void validateNullQuestions(List<String> questionValues) {
        if (Objects.isNull(questionValues)) {
            throw new ReviewFormException("회고 폼의 질문 목록 생성 중 오류가 발생했습니다.");
        }
    }

    private void validateTitleLength(String reviewTitle) {
        if (reviewTitle.length() > 100) {
            throw new ReviewFormException("회고 폼의 제목은 100자를 넘을 수 없습니다.");
        }
    }

    private void validateBlankTitle(String reviewTitle) {
        if (Objects.isNull(reviewTitle) || reviewTitle.isBlank()) {
            throw new ReviewFormException("회고 폼의 제목은 비어있을 수 없습니다.");
        }
    }
}
