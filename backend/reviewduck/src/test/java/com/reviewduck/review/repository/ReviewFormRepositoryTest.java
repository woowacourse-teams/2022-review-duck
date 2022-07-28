package com.reviewduck.review.repository;

import static org.assertj.core.api.Assertions.*;
import static org.junit.jupiter.api.Assertions.*;

import java.util.List;
import java.util.stream.Collectors;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import com.reviewduck.member.domain.Member;
import com.reviewduck.member.repository.MemberRepository;
import com.reviewduck.review.domain.ReviewForm;
import com.reviewduck.review.domain.ReviewFormQuestion;

@DataJpaTest
public class ReviewFormRepositoryTest {

    @Autowired
    private ReviewFormRepository reviewFormRepository;

    @Autowired
    private MemberRepository memberRepository;

    @Test
    @DisplayName("리뷰 폼을 저장한다.")
    void saveReviewForm() {
        // given
        List<String> questionValues = List.of("question1", "question2");
        List<ReviewFormQuestion> reviewFormQuestions = getReviewFormQuestions(questionValues);
        Member member = new Member("panda", "제이슨", "testUrl");
        memberRepository.save(member);
        ReviewForm reviewForm = new ReviewForm(member, "title", questionValues);

        // when
        ReviewForm savedReviewForm = reviewFormRepository.save(reviewForm);

        // then
        assertAll(
            () -> assertThat(savedReviewForm.getId()).isNotNull(),
            () -> assertThat(savedReviewForm.getMember().getSocialId()).isEqualTo("panda"),
            () -> assertThat(savedReviewForm.getCode().length()).isEqualTo(8),
            () -> assertThat(savedReviewForm.getReviewFormQuestions())
                .usingRecursiveComparison()
                .ignoringFields("id")
                .isEqualTo(reviewFormQuestions)
        );
    }

    @Test
    @DisplayName("개인이 작성한 회고 폼을 조회한다.")
    void findMyReviewForms() {
        // given
        List<String> questionValues1 = List.of("question1", "question2");
        getReviewFormQuestions(questionValues1);

        Member member1 = new Member("panda", "제이슨", "testUrl1");
        memberRepository.save(member1);
        ReviewForm reviewForm1 = new ReviewForm(member1, "title1", questionValues1);

        List<String> questionValues2 = List.of("question3", "question4");
        getReviewFormQuestions(questionValues2);

        Member member2 = new Member("ariari", "브리", "testUrl2");
        memberRepository.save(member2);
        ReviewForm reviewForm2 = new ReviewForm(member2, "title2", questionValues2);

        reviewFormRepository.save(reviewForm1);
        reviewFormRepository.save(reviewForm2);

        // when
        List<ReviewForm> myReviewForms = reviewFormRepository.findByMember(member1);

        // then
        assertAll(
            () -> assertThat(myReviewForms).hasSize(1),
            () -> assertThat(myReviewForms.get(0)).isNotNull(),
            () -> assertThat(myReviewForms.get(0).getMember().getNickname()).isEqualTo("제이슨")
        );
    }

    private List<ReviewFormQuestion> getReviewFormQuestions(List<String> questionValues) {
        List<ReviewFormQuestion> reviewFormQuestions = questionValues.stream()
            .map(ReviewFormQuestion::new)
            .collect(Collectors.toUnmodifiableList());

        int index = 0;
        for (ReviewFormQuestion reviewFormQuestion : reviewFormQuestions) {
            reviewFormQuestion.setPosition(index++);
        }
        return reviewFormQuestions;
    }
}
