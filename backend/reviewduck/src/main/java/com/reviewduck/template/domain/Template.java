package com.reviewduck.template.domain;

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
import javax.persistence.OrderBy;

import com.reviewduck.template.exception.TemplateException;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
public class Template {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false)
    private Long id;

    @Column(nullable = false)
    private String templateTitle;

    @Column(nullable = false)
    private String templateDescription;

    @OneToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinColumn(name = "template_id")
    @OrderBy("position asc")
    private List<TemplateQuestion> questions;

    public Template(String templateTitle, String templateDescription, List<String> questionValues) {
        validate(templateTitle, templateDescription, questionValues);
        this.templateTitle = templateTitle;
        this.templateDescription = templateDescription;
        this.questions = setQuestions(questionValues);
    }

    private List<TemplateQuestion> setQuestions(List<String> questionValues) {
        List<TemplateQuestion> questions = questionValues.stream()
            .map(TemplateQuestion::new)
            .collect(Collectors.toUnmodifiableList());
        sortQuestions(questions);
        return questions;
    }

    private void sortQuestions(List<TemplateQuestion> questions) {
        int index = 0;
        for (TemplateQuestion question : questions) {
            question.setPosition(index++);
        }
    }

    public void update(String templateTitle, String templateDescription, List<TemplateQuestion> questions) {
        validateTitleLength(templateTitle);
        validateBlankTitle(templateTitle);
        validateNullDescription(templateDescription);

        this.templateTitle = templateTitle;
        this.templateDescription = templateDescription;
        sortQuestions(questions);
        this.questions = questions;
    }

    private void validate(String templateTitle, String templateDescription, List<String> questionValues) {
        validateBlankTitle(templateTitle);
        validateTitleLength(templateTitle);
        validateNullDescription(templateDescription);
        validateNullQuestions(questionValues);
    }

    private void validateNullQuestions(List<String> questionValues) {
        if (Objects.isNull(questionValues)) {
            throw new TemplateException("템플릿의 질문 목록 생성 중 오류가 발생했습니다.");
        }
    }

    private void validateTitleLength(String reviewTitle) {
        if (reviewTitle.length() > 100) {
            throw new TemplateException("템플릿의 제목은 100자를 넘을 수 없습니다.");
        }
    }

    private void validateBlankTitle(String templateTitle) {
        if (Objects.isNull(templateTitle) || templateTitle.isBlank()) {
            throw new TemplateException("템플릿의 제목은 비어있을 수 없습니다.");
        }
    }

    private void validateNullDescription(String templateDescription) {
        if (Objects.isNull(templateDescription)) {
            throw new TemplateException("템플릿의 설명 작성 중 오류가 발생했습니다.");
        }
    }
}
