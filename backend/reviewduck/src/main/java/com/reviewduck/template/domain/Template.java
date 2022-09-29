package com.reviewduck.template.domain;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.reviewduck.common.domain.BaseDate;
import com.reviewduck.member.domain.Member;
import com.reviewduck.template.dto.service.TemplateQuestionCreateDto;
import com.reviewduck.template.dto.service.TemplateQuestionUpdateDto;
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

    @OneToMany(mappedBy = "template", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private final List<TemplateQuestion> questions = new ArrayList<>();

    @Column
    private int usedCount;

    public Template(Member member, String templateTitle, String templateDescription,
        List<TemplateQuestionCreateDto> questions) {
        validateWhenCreate(member, templateTitle, templateDescription, questions);

        this.templateTitle = templateTitle;
        this.member = member;
        this.templateDescription = templateDescription;
        this.usedCount = 0;
        this.questions.addAll(createQuestionsFrom(questions));
        sortQuestions();
    }

    public void update(String templateTitle, String templateDescription, List<TemplateQuestionUpdateDto> questions) {
        validateWhenUpdate(templateTitle, templateDescription, questions);

        this.templateTitle = templateTitle;
        this.templateDescription = templateDescription;
        updateQuestions(questions);
    }

    public boolean isMine(Member member) {
        return member.equals(this.member);
    }

    private List<TemplateQuestion> createQuestionsFrom(List<TemplateQuestionCreateDto> questions) {
        return questions.stream()
            .map(question -> new TemplateQuestion(question.getValue(), question.getDescription(), this))
            .collect(Collectors.toUnmodifiableList());
    }

    private void updateQuestions(List<TemplateQuestionUpdateDto> questions) {
        int beforeSize = this.questions.size();

        List<TemplateQuestion> updatedQuestions = questions.stream()
            .map(this::createOrUpdateQuestion)
            .collect(Collectors.toUnmodifiableList());
        this.questions.addAll(updatedQuestions);

        this.questions.subList(0, beforeSize).clear();

        sortQuestions();
    }

    private TemplateQuestion createOrUpdateQuestion(TemplateQuestionUpdateDto question) {
        Optional<TemplateQuestion> existedQuestion = questions.stream()
            .filter(it -> question.getId() != null && Objects.equals(it.getId(), question.getId()))
            .findAny();

        if (existedQuestion.isPresent()) {
            TemplateQuestion updatedQuestion = existedQuestion.get();
            updatedQuestion.update(question.getValue(), question.getDescription());
            return updatedQuestion;
        }

        return new TemplateQuestion(question.getValue(), question.getDescription(), this);
    }

    private void sortQuestions() {
        int index = 0;
        for (TemplateQuestion question : questions) {
            question.setPosition(index++);
        }
    }

    private void validateWhenCreate(Member member, String templateTitle, String templateDescription,
        List<TemplateQuestionCreateDto> questions) {
        validateBlankTitle(templateTitle);
        validateTitleLength(templateTitle);
        validateNullMember(member);
        validateNullDescription(templateDescription);
        validateNullQuesions(questions);
    }

    private void validateWhenUpdate(String templateTitle, String templateDescription,
        List<TemplateQuestionUpdateDto> questions) {
        validateBlankTitle(templateTitle);
        validateTitleLength(templateTitle);
        validateNullDescription(templateDescription);
        validateNullQuesions(questions);
    }

    private void validateBlankTitle(String templateTitle) {
        if (Objects.isNull(templateTitle) || templateTitle.isBlank()) {
            throw new TemplateException("템플릿의 제목은 비어있을 수 없습니다.");
        }
    }

    private void validateTitleLength(String reviewTitle) {
        if (reviewTitle.length() > 100) {
            throw new TemplateException("템플릿의 제목은 100자를 넘을 수 없습니다.");
        }
    }

    private void validateNullMember(Member member) {
        if (member == null) {
            throw new TemplateException("템플릿의 작성자가 존재해야 합니다.");
        }
    }

    private void validateNullDescription(String templateDescription) {
        if (templateDescription == null) {
            throw new TemplateException("템플릿의 설명 작성 중 오류가 발생했습니다.");
        }
    }

    private void validateNullQuesions(List<?> questions) {
        if (questions == null) {
            throw new TemplateException("템플릿의 질문 작성 중 오류가 발생했습니다.");
        }
    }

}
