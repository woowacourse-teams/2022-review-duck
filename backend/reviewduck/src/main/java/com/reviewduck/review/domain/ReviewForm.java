package com.reviewduck.review.domain;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

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

import org.apache.commons.lang3.RandomStringUtils;

import com.reviewduck.common.domain.BaseDate;
import com.reviewduck.member.domain.Member;
import com.reviewduck.review.exception.ReviewFormException;

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

    @JoinColumn(name = "review_form_id")
    @OneToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @OrderBy("position asc")
    private List<ReviewFormQuestion> reviewFormQuestions;

    @Column(nullable = false)
    private boolean isActive = true;

    public ReviewForm(Member member, String title, List<String> questionValues) {
        validate(title, member, questionValues);
        this.title = title;
        this.member = member;
        this.reviewFormQuestions = setReviewFormQuestions(questionValues);
        this.code = RandomStringUtils.randomAlphanumeric(8).toUpperCase();
    }

    public void update(String title, List<ReviewFormQuestion> reviewFormQuestions) {
        validateTitleLength(title);
        validateBlankTitle(title);
        this.title = title;
        sortQuestions(reviewFormQuestions);
        this.reviewFormQuestions = reviewFormQuestions;
    }

    public boolean isMine(Member member) {
        return member.equals(this.member);
    }

    private List<ReviewFormQuestion> setReviewFormQuestions(List<String> questionValues) {
        List<ReviewFormQuestion> reviewFormQuestions = questionValues.stream()
            .map(ReviewFormQuestion::new)
            .collect(Collectors.toUnmodifiableList());
        sortQuestions(reviewFormQuestions);
        return reviewFormQuestions;
    }

    private void sortQuestions(List<ReviewFormQuestion> reviewFormQuestions) {
        int index = 0;
        for (ReviewFormQuestion reviewFormQuestion : reviewFormQuestions) {
            reviewFormQuestion.setPosition(index++);
        }
    }

    private void validate(String title, Member member, List<String> questionValues) {
        validateBlankTitle(title);
        validateTitleLength(title);
        validateNullMember(member);
        validateNullQuestions(questionValues);
    }

    private void validateNullMember(Member member) {
        if (Objects.isNull(member)) {
            throw new ReviewFormException("회고 폼의 작성자가 존재해야 합니다.");
        }
    }

    private void validateNullQuestions(List<String> questionValues) {
        if (Objects.isNull(questionValues)) {
            throw new ReviewFormException("회고 폼의 질문 목록 생성 중 오류가 발생했습니다.");
        }
    }

    private void validateTitleLength(String title) {
        if (title.length() > 100) {
            throw new ReviewFormException("회고 폼의 제목은 100자를 넘을 수 없습니다.");
        }
    }

    private void validateBlankTitle(String title) {
        if (Objects.isNull(title) || title.isBlank()) {
            throw new ReviewFormException("회고 폼의 제목은 비어있을 수 없습니다.");
        }
    }
}
