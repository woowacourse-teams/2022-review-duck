package com.reviewduck.template.domain;

import java.util.List;
import java.util.Objects;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.OrderBy;

import com.reviewduck.common.domain.BaseDate;
import com.reviewduck.member.domain.Member;
import com.reviewduck.template.exception.TemplateException;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
public class Template extends BaseDate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    private Member member;

    @Column(nullable = false)
    private String templateTitle;

    @Column(nullable = false)
    private String templateDescription;

    @OneToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinColumn(name = "template_id")
    @OrderBy("position asc")
    private List<TemplateQuestion> questions;

    @Column
    private int usedCount;

    public Template(Member member, String templateTitle, String templateDescription, List<TemplateQuestion> questions) {
        validateWhenCreate(member, templateTitle, templateDescription, questions);

        this.templateTitle = templateTitle;
        this.member = member;
        this.templateDescription = templateDescription;
        this.questions = questions;
        this.usedCount = 0;

        sortQuestions();
    }

    public void update(String templateTitle, String templateDescription, List<TemplateQuestion> questions) {
        validateWhenUpdate(templateTitle, templateDescription);

        this.templateTitle = templateTitle;
        this.templateDescription = templateDescription;
        this.questions = questions;

        sortQuestions();
    }

    public boolean isMine(Member member) {
        return member.equals(this.member);
    }

    private void sortQuestions() {
        int index = 0;
        for (TemplateQuestion question : questions) {
            question.setPosition(index++);
        }
    }

    private void validateWhenUpdate(String templateTitle, String templateDescription) {
        validateTitleLength(templateTitle);
        validateBlankTitle(templateTitle);
        validateNullDescription(templateDescription);
    }

    private void validateWhenCreate(Member member, String templateTitle, String templateDescription,
        List<TemplateQuestion> questions) {
        validateBlankTitle(templateTitle);
        validateTitleLength(templateTitle);
        validateNullMember(member);
        validateNullDescription(templateDescription);
        validateNullQuestions(questions);
    }

    private void validateNullMember(Member member) {
        if (Objects.isNull(member)) {
            throw new TemplateException("템플릿의 작성자가 존재해야 합니다.");
        }
    }

    private void validateNullQuestions(List<TemplateQuestion> questions) {
        if (Objects.isNull(questions)) {
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
