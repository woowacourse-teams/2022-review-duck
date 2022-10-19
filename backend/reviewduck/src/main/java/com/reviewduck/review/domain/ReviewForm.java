package com.reviewduck.review.domain;

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
import javax.persistence.OrderBy;

import org.apache.commons.lang3.RandomStringUtils;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.reviewduck.common.domain.BaseDate;
import com.reviewduck.common.exception.NotFoundException;
import com.reviewduck.member.domain.Member;
import com.reviewduck.review.exception.ReviewFormException;
import com.reviewduck.review.dto.service.ReviewFormQuestionCreateDto;
import com.reviewduck.review.dto.service.ReviewFormQuestionUpdateDto;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
public class ReviewForm extends BaseDate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    private Member member;

    @Column(name = "code", nullable = false, updatable = false)
    private String code;

    @Column(nullable = false)
    private String title;

    @SuppressWarnings("FieldMayBeFinal")
    @Column(nullable = false)
    private boolean isActive = true;

    @OneToMany(mappedBy = "reviewForm", cascade = {CascadeType.PERSIST, CascadeType.MERGE}, orphanRemoval = true)
    @OrderBy("position asc")
    @JsonIgnore
    private final List<ReviewFormQuestion> questions = new ArrayList<>();

    public ReviewForm(Member member, String title, List<ReviewFormQuestionCreateDto> questions) {
        validateWhenCreate(member, title, questions);

        this.title = title;
        this.member = member;
        this.questions.addAll(createQuestionsFrom(questions));
        this.code = RandomStringUtils.randomAlphanumeric(8).toUpperCase();
        sortQuestions();
    }

    public void update(String title, List<ReviewFormQuestionUpdateDto> questions) {
        validateWhenUpdate(title, questions);

        this.title = title;
        updateQuestions(questions);
    }

    public boolean isMine(long memberId) {
        return this.member.isSameId(memberId);
    }

    private List<ReviewFormQuestion> createQuestionsFrom(List<ReviewFormQuestionCreateDto> questions) {
        return questions.stream()
            .map(question -> new ReviewFormQuestion(question.getValue(), question.getDescription(), this))
            .collect(Collectors.toUnmodifiableList());
    }

    private void sortQuestions() {
        int index = 0;
        for (ReviewFormQuestion reviewFormQuestion : this.questions) {
            reviewFormQuestion.setPosition(index++);
        }
    }

    private void updateQuestions(List<ReviewFormQuestionUpdateDto> questions) {
        int beforeSize = this.questions.size();

        List<ReviewFormQuestion> updatedQuestions = questions.stream()
            .map(this::createOrUpdateQuestion)
            .collect(Collectors.toUnmodifiableList());
        this.questions.addAll(updatedQuestions);

        this.questions.subList(0, beforeSize).clear();

        sortQuestions();
    }

    private ReviewFormQuestion createOrUpdateQuestion(ReviewFormQuestionUpdateDto question) {
        Optional<ReviewFormQuestion> existedQuestion = questions.stream()
            .filter(it -> question.getId() != null && Objects.equals(it.getId(), question.getId()))
            .findAny();

        if (existedQuestion.isPresent()) {
            ReviewFormQuestion updatedQuestion = existedQuestion.get();
            updatedQuestion.update(question.getValue(), question.getDescription());
            return updatedQuestion;
        }

        return new ReviewFormQuestion(question.getValue(), question.getDescription(), this);
    }

    private void validateWhenCreate(Member member, String title, List<ReviewFormQuestionCreateDto> questions) {
        validateBlankTitle(title);
        validateTitleLength(title);
        validateNullMember(member);
        validateNullQuestions(questions);
    }

    private void validateWhenUpdate(String title, List<ReviewFormQuestionUpdateDto> questions) {
        validateBlankTitle(title);
        validateTitleLength(title);
        validateNullQuestions(questions);
        validateQuestionsUpdatable(questions);
    }

    private void validateBlankTitle(String title) {
        if (title == null || title.isBlank()) {
            throw new ReviewFormException("회고 폼의 제목은 비어있을 수 없습니다.");
        }
    }

    private void validateTitleLength(String title) {
        if (title.length() > 100) {
            throw new ReviewFormException("회고 폼의 제목은 100자를 넘을 수 없습니다.");
        }
    }

    private void validateNullMember(Member member) {
        if (member == null) {
            throw new ReviewFormException("회고 폼의 작성자가 존재해야 합니다.");
        }
    }

    private void validateNullQuestions(List<?> questionValues) {
        if (questionValues == null) {
            throw new ReviewFormException("회고 폼의 질문 목록 생성 중 오류가 발생했습니다.");
        }
    }

    private void validateQuestionsUpdatable(List<ReviewFormQuestionUpdateDto> questions) {
        questions.stream()
            .filter(this::isQuestionUpdatable)
            .findAny()
            .orElseThrow(() -> new NotFoundException("존재하지 않는 질문입니다."));
    }

    private boolean isQuestionUpdatable(ReviewFormQuestionUpdateDto questionToUpdate) {
        if (questionToUpdate.getId() == null) {
            return true;
        }
        return this.questions.stream()
            .anyMatch(question -> Objects.equals(question.getId(), questionToUpdate.getId()));
    }
}
