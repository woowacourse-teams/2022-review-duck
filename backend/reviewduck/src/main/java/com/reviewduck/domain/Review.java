package com.reviewduck.domain;

import static lombok.AccessLevel.*;

import java.util.List;
import java.util.Objects;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.OrderBy;

import com.reviewduck.exception.ReviewException;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor(access = PROTECTED)
@Getter
public class Review extends BaseDate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nickname;

    @ManyToOne(fetch = FetchType.LAZY)
    private ReviewForm reviewForm;

    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "review_id")
    @OrderBy("position asc")
    private List<QuestionAnswer> questionAnswers;

    private Review(String nickname, ReviewForm reviewForm, List<QuestionAnswer> questionAnswers) {
        sortQuestionAnswers(questionAnswers);
        this.nickname = nickname;
        this.reviewForm = reviewForm;
        this.questionAnswers = questionAnswers;
    }

    public static Review of(String nickname, ReviewForm reviewForm, List<QuestionAnswer> questionAnswers) {
        validate(nickname);
        return new Review(nickname, reviewForm, questionAnswers);
    }

    private static void validate(String nickname) {
        if (Objects.isNull(nickname) || nickname.isBlank()) {
            throw new ReviewException("닉네임이 비어있을 수 없습니다.");
        }
    }

    private void sortQuestionAnswers(List<QuestionAnswer> questionAnswers) {
        int index = 0;
        for (QuestionAnswer questionAnswer : questionAnswers) {
            questionAnswer.setPosition(index++);
        }
    }

    public void update(List<QuestionAnswer> questionAnswers) {
        this.questionAnswers = questionAnswers;
    }
}
