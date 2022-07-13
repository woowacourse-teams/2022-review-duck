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
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.OrderColumn;

import com.reviewduck.exception.ReviewException;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor(access = PROTECTED)
@Getter
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nickname;

    @ManyToOne(fetch = FetchType.LAZY)
    private ReviewForm reviewForm;

    @OrderColumn
    @OneToMany(cascade = CascadeType.ALL)
    private List<QuestionAnswer> questionAnswers;

    private Review(String nickname, ReviewForm reviewForm, List<QuestionAnswer> questionAnswers) {
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
}
