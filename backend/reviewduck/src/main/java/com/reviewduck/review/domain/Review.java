package com.reviewduck.review.domain;

import static lombok.AccessLevel.*;

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
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.OrderBy;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.reviewduck.common.domain.BaseDate;
import com.reviewduck.member.domain.Member;
import com.reviewduck.review.dto.service.ReviewCreateDto;
import com.reviewduck.review.exception.ReviewException;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor(access = PROTECTED)
@Getter
public class Review extends BaseDate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @ManyToOne(fetch = FetchType.LAZY)
    private Member member;

    @ManyToOne(fetch = FetchType.LAZY)
    private ReviewForm reviewForm;

    private boolean isPrivate;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "review", fetch = FetchType.LAZY)
    @OrderBy("position asc")
    @JsonIgnore
    private List<QuestionAnswer> questionAnswers;

    @Column(nullable = false)
    private int likes;

    public Review(String title, Member member, ReviewForm reviewForm, List<ReviewCreateDto> createDtos,
        boolean isPrivate) {
        validate(title);
        this.title = title;
        this.member = member;
        this.reviewForm = reviewForm;
        this.isPrivate = isPrivate;
        this.questionAnswers = createDtos.stream()
            .map(it -> new QuestionAnswer(it.getReviewFormQuestion(), it.getAnswer(), this))
            .collect(Collectors.toUnmodifiableList());

        sortQuestionAnswers();
    }

    public void update(boolean isPrivate, List<QuestionAnswer> questionAnswers) {
        this.questionAnswers = questionAnswers;
        this.isPrivate = isPrivate;
        super.renewUpdatedAt();
    }

    public boolean isMine(Member member) {
        return this.member.equals(member);
    }

    private void sortQuestionAnswers() {
        int index = 0;
        for (QuestionAnswer questionAnswer : questionAnswers) {
            questionAnswer.setPosition(index++);
        }
    }

    private void validate(String title) {
        if (Objects.isNull(title) || title.isBlank()) {
            throw new ReviewException("회고의 제목은 비어있을 수 없습니다.");
        }
    }

    public int like(int likeCount) {
        likes += likeCount;
        return likes;
    }
}
