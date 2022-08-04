package com.reviewduck.review.domain;

import static lombok.AccessLevel.*;

import java.util.List;

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

import com.reviewduck.common.domain.BaseDate;
import com.reviewduck.member.domain.Member;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor(access = PROTECTED)
@Getter
public class Review extends BaseDate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    private Member member;

    @ManyToOne(fetch = FetchType.LAZY)
    private ReviewForm reviewForm;

    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "review_id")
    @OrderBy("position asc")
    private List<QuestionAnswer> questionAnswers;

    public Review(Member member, ReviewForm reviewForm, List<QuestionAnswer> questionAnswers) {
        sortQuestionAnswers(questionAnswers);
        this.member = member;
        this.reviewForm = reviewForm;
        this.questionAnswers = questionAnswers;
    }

    public void update(List<QuestionAnswer> questionAnswers) {
        this.questionAnswers = questionAnswers;
    }

    public boolean isMine(Member member) {
        return member.equals(this.member);
    }

    public void renewUpdatedAt(){
        super.renewUpdatedAt();
    }

    private void sortQuestionAnswers(List<QuestionAnswer> questionAnswers) {
        int index = 0;
        for (QuestionAnswer questionAnswer : questionAnswers) {
            questionAnswer.setPosition(index++);
        }
    }
}
