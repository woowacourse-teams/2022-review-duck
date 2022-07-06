package com.reviewduck.domain;

import static lombok.AccessLevel.*;

import java.util.Map;
import java.util.Objects;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToOne;
import javax.persistence.MapKeyJoinColumn;
import javax.persistence.OneToMany;

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

    @OneToMany(cascade = CascadeType.ALL)
    @JoinTable(name = "question_answer",
        joinColumns = {@JoinColumn(name = "review_id", referencedColumnName = "id")},
        inverseJoinColumns = {@JoinColumn(name = "answer_id", referencedColumnName = "id")})
    @MapKeyJoinColumn(name = "question_id")
    private Map<Question, Answer> answersByQuestions;

    private Review(String nickname, ReviewForm reviewForm, Map<Question, Answer> answersByQuestions) {
        this.nickname = nickname;
        this.reviewForm = reviewForm;
        this.answersByQuestions = answersByQuestions;
    }

    public static Review of(String nickname, ReviewForm reviewForm, Map<Question, Answer> answersByQuestions) {
        validate(nickname);

        return new Review(nickname, reviewForm, answersByQuestions);
    }

    private static void validate(String nickname) {
        if (Objects.isNull(nickname) || nickname.isBlank()) {
            throw new ReviewException("닉네임이 비어있을 수 없습니다.");
        }
    }
}
