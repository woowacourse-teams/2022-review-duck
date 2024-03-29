package com.reviewduck.template.domain;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.reviewduck.template.exception.TemplateQuestionException;

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
    private String description;

    @Column(nullable = false)
    private int position = -1;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "template_id")
    private Template template;

    public TemplateQuestion(String value, String description) {
        validateQuestion(value, description);

        this.value = value;
        this.description = description;
    }

    public TemplateQuestion(String value, String description, Template template) {
        validateQuestion(value, description);

        this.value = value;
        this.description = description;
        this.template = template;
    }

    public void update(String value, String description) {
        validateQuestion(value, description);

        this.value = value;
        this.description = description;
    }

    public void setPosition(int position) {
        validatePosition(position);
        this.position = position;
    }

    private void validateQuestion(final String value, final String description) {
        validateValue(value);
        validateDescription(description);
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
            throw new TemplateQuestionException("질문 생성 중 에러가 발생하였습니다.");
        }
    }

    private void validateBlank(String value) {
        if (value.isBlank()) {
            throw new TemplateQuestionException("질문 내용은 비어있을 수 없습니다.");
        }
    }

    private void validateLength(String value) {
        if (value.length() > 200) {
            throw new TemplateQuestionException("질문은 200자를 넘을 수 없습니다.");
        }
    }

    private void validatePosition(int position) {
        if (position < 0) {
            throw new TemplateQuestionException("질문 생성 중 에러가 발생하였습니다.");
        }
    }
}
