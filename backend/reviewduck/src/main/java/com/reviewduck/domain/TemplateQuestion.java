package com.reviewduck.domain;

import java.util.Objects;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import com.reviewduck.exception.QuestionException;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@Table(name = "template_question")
public class TemplateQuestion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false)
    private Long id;

    @Column(name = "question_value", nullable = false)
    private String value;

    @Column(nullable = false)
    private int position = -1;

    public TemplateQuestion(String value) {
        validate(value);
        this.value = value;
    }

    public void updateValue(String value) {
        this.value = value;
    }

    private void validate(String value) {
        validateNull(value);
        validateLength(value);
    }

    private void validateLength(String value) {
        if (value.length() > 200) {
            throw new QuestionException("질문은 200자를 넘을 수 없습니다.");
        }
    }

    private void validateNull(String value) {
        if (Objects.isNull(value) || value.isBlank()) {
            throw new QuestionException("질문 내용은 비어있을 수 없습니다.");
        }
    }

    public void setPosition(int position) {
        this.position = position;
    }
}
