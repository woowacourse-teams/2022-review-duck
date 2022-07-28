package com.reviewduck.review.service;

import static org.assertj.core.api.Assertions.*;
import static org.junit.jupiter.api.Assertions.*;

import java.util.List;
import java.util.stream.Collectors;

import javax.transaction.Transactional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.jdbc.Sql;

import com.reviewduck.auth.exception.AuthorizationException;
import com.reviewduck.common.exception.NotFoundException;
import com.reviewduck.member.domain.Member;
import com.reviewduck.member.service.MemberService;
import com.reviewduck.review.domain.ReviewForm;
import com.reviewduck.review.domain.ReviewFormQuestion;
import com.reviewduck.review.dto.request.ReviewFormCreateFromTemplateRequest;
import com.reviewduck.review.dto.request.ReviewFormCreateRequest;
import com.reviewduck.review.dto.request.ReviewFormQuestionRequest;
import com.reviewduck.review.dto.request.ReviewFormUpdateRequest;
import com.reviewduck.review.dto.request.ReviewQuestionUpdateRequest;
import com.reviewduck.template.domain.Template;
import com.reviewduck.template.dto.request.TemplateCreateRequest;
import com.reviewduck.template.dto.request.TemplateQuestionRequest;
import com.reviewduck.template.service.TemplateService;

@SpringBootTest
@Sql("classpath:truncate.sql")
@Transactional
public class ReviewFormServiceTest {

    private final String invalidCode = "aaaaaaaa";

    @Autowired
    private ReviewFormService reviewFormService;

    @Autowired
    private TemplateService templateService;

    @Autowired
    private MemberService memberService;

    private Member member1;
    private Member member2;

    @BeforeEach
    void setUp() {
        Member tempMember1 = new Member("jason", "제이슨", "testUrl1");
        member1 = memberService.save(tempMember1);

        Member tempMember2 = new Member("woni", "워니", "testUrl2");
        member2 = memberService.save(tempMember2);
    }

    @Test
    @DisplayName("회고 폼을 생성한다.")
    void createReviewForm() {
        // given
        String reviewTitle = "title";
        List<ReviewFormQuestionRequest> questions = List.of(new ReviewFormQuestionRequest("question1"),
            new ReviewFormQuestionRequest("question2"));

        ReviewFormCreateRequest createRequest = new ReviewFormCreateRequest(reviewTitle, questions);

        List<ReviewFormQuestion> expected = questions.stream()
            .map(questionRequest -> new ReviewFormQuestion(questionRequest.getQuestionValue()))
            .collect(Collectors.toList());

        int index = 0;
        for (ReviewFormQuestion reviewFormQuestion : expected) {
            reviewFormQuestion.setPosition(index++);
        }

        // when
        ReviewForm reviewForm = reviewFormService.save(member1, createRequest);

        // then
        assertAll(
            () -> assertThat(reviewForm).isNotNull(),
            () -> assertThat(reviewForm.getId()).isNotNull(),
            () -> assertThat(reviewForm.getMember().getNickname()).isEqualTo("제이슨"),
            () -> assertThat(reviewForm.getCode().length()).isEqualTo(8),
            () -> assertThat(reviewForm.getReviewTitle()).isEqualTo(reviewTitle),
            () -> assertThat(reviewForm.getReviewFormQuestions())
                .usingRecursiveComparison()
                .ignoringFields("id")
                .isEqualTo(expected)
        );
    }

    @Test
    @DisplayName("회고 폼 코드로 회고 폼을 조회한다.")
    void findReviewForm() {
        // given
        String reviewTitle = "title";
        List<ReviewFormQuestionRequest> questions = List.of(new ReviewFormQuestionRequest("question1"),
            new ReviewFormQuestionRequest("question2"));
        ReviewFormCreateRequest createRequest = new ReviewFormCreateRequest(reviewTitle, questions);

        ReviewForm expected = reviewFormService.save(member1, createRequest);

        // when
        ReviewForm actual = reviewFormService.findByCode(expected.getCode());

        // then
        assertThat(expected).isSameAs(actual);
    }

    @Test
    @DisplayName("존재하지 않는 코드로 조회할 수 없다.")
    void findReviewFormByInvalidCode() {
        // when, then
        assertThatThrownBy(() -> reviewFormService.findByCode(invalidCode))
            .isInstanceOf(NotFoundException.class)
            .hasMessageContaining("존재하지 않는 회고 폼입니다.");
    }

    @Test
    @DisplayName("회고 폼을 수정한다.")
    void updateReviewForm() {
        // given
        ReviewForm savedReviewForm = saveReviewForm(member1);
        String code = savedReviewForm.getCode();
        Long questionId = savedReviewForm.getReviewFormQuestions().get(0).getId();

        // when
        String reviewTitle = "new title";
        List<ReviewQuestionUpdateRequest> updateRequests = List.of(
            new ReviewQuestionUpdateRequest(questionId, "new question1"),
            new ReviewQuestionUpdateRequest(null, "new question3"));

        ReviewFormUpdateRequest updateRequest = new ReviewFormUpdateRequest(reviewTitle, updateRequests);

        List<ReviewFormQuestion> expected = updateRequests.stream()
            .map(questionRequest -> new ReviewFormQuestion(questionRequest.getQuestionValue()))
            .collect(Collectors.toList());

        int index = 0;
        for (ReviewFormQuestion reviewFormQuestion : expected) {
            reviewFormQuestion.setPosition(index++);
        }

        reviewFormService.update(member1, code, updateRequest);
        ReviewForm foundReviewForm = reviewFormService.findByCode(code);

        assertAll(
            () -> assertThat(foundReviewForm).isNotNull(),
            () -> assertThat(foundReviewForm.getId()).isNotNull(),
            () -> assertThat(foundReviewForm.getMember().getNickname()).isEqualTo("제이슨"),
            () -> assertThat(foundReviewForm.getCode().length()).isEqualTo(8),
            () -> assertThat(foundReviewForm.getReviewTitle()).isEqualTo(reviewTitle),
            () -> assertThat(foundReviewForm.getReviewFormQuestions())
                .usingRecursiveComparison()
                .ignoringFields("id")
                .isEqualTo(expected)
        );
    }

    @Test
    @DisplayName("본인이 생성한 회고가 아니면 수정할 수 없다.")
    void updateNotMyReviewForm() {
        // given
        ReviewForm savedReviewForm = saveReviewForm(member1);
        String code = savedReviewForm.getCode();
        Long questionId = savedReviewForm.getReviewFormQuestions().get(0).getId();

        // when
        String reviewTitle = "new title";
        List<ReviewQuestionUpdateRequest> updateRequests = List.of(
            new ReviewQuestionUpdateRequest(questionId, "new question1"),
            new ReviewQuestionUpdateRequest(null, "new question3"));

        ReviewFormUpdateRequest updateRequest = new ReviewFormUpdateRequest(reviewTitle, updateRequests);

        List<ReviewFormQuestion> expected = updateRequests.stream()
            .map(questionRequest -> new ReviewFormQuestion(questionRequest.getQuestionValue()))
            .collect(Collectors.toList());

        int index = 0;
        for (ReviewFormQuestion reviewFormQuestion : expected) {
            reviewFormQuestion.setPosition(index++);
        }

        assertThatThrownBy(() -> reviewFormService.update(member2, code, updateRequest))
            .isInstanceOf(AuthorizationException.class)
            .hasMessageContaining("본인이 생성한 회고폼이 아니면 수정할 수 없습니다.");
    }

    @Test
    @DisplayName("존재하지 않는 회고폼을 수정할 수 없다.")
    void updateReviewFormByInvalidCode() {
        // when
        List<ReviewQuestionUpdateRequest> updateRequests = List.of(new ReviewQuestionUpdateRequest(1L, "new question1"),
            new ReviewQuestionUpdateRequest(null, "new question3"),
            new ReviewQuestionUpdateRequest(2L, "new question2"));
        ReviewFormUpdateRequest reviewFormUpdateRequest = new ReviewFormUpdateRequest("new title", updateRequests);
        assertThatThrownBy(() -> reviewFormService.update(member1, invalidCode, reviewFormUpdateRequest))
            .isInstanceOf(NotFoundException.class)
            .hasMessageContaining("존재하지 않는 회고 폼입니다.");
    }

    @Test
    @DisplayName("존재하지 않는 질문을 수정할 수 없다.")
    void updateReviewFormByInvalidQuestionId() {
        // given
        String code = saveReviewForm(member1).getCode();

        // when, then
        List<ReviewQuestionUpdateRequest> updateRequests = List.of(
            new ReviewQuestionUpdateRequest(9999999L, "new question"));

        assertThatThrownBy(
            () -> reviewFormService.update(member1, code, new ReviewFormUpdateRequest("new title", updateRequests)))
            .isInstanceOf(NotFoundException.class)
            .hasMessageContaining("존재하지 않는 질문입니다.");

    }

    @Test
    @DisplayName("템플릿을 기반으로 회고 폼을 생성한다.")
    void saveReviewFormFromTemplate() {
        // when
        // 템플릿 생성
        String templateTitle = "title";
        String templateDescription = "description";
        List<TemplateQuestionRequest> questions = List.of(new TemplateQuestionRequest("question1"),
            new TemplateQuestionRequest("question2"));

        TemplateCreateRequest templateRequest = new TemplateCreateRequest(templateTitle, templateDescription,
            questions);
        Template savedTemplate = templateService.save(member1, templateRequest);

        // 템플릿 기반 회고 폼 생성
        String reviewFormTitle = "reviewFormTitle";
        ReviewFormCreateFromTemplateRequest request = new ReviewFormCreateFromTemplateRequest(reviewFormTitle);
        ReviewForm savedReviewForm = reviewFormService.saveFromTemplate(member1, savedTemplate.getId(), request);

        List<ReviewFormQuestion> expected = questions.stream()
            .map(questionRequest -> new ReviewFormQuestion(questionRequest.getQuestionValue()))
            .collect(Collectors.toList());

        int index = 0;
        for (ReviewFormQuestion reviewFormQuestion : expected) {
            reviewFormQuestion.setPosition(index++);
        }

        // then
        assertAll(
            () -> assertThat(savedReviewForm).isNotNull(),
            () -> assertThat(savedReviewForm.getId()).isNotNull(),
            () -> assertThat(savedReviewForm.getMember().getNickname()).isEqualTo("제이슨"),
            () -> assertThat(savedReviewForm.getCode().length()).isEqualTo(8),
            () -> assertThat(savedReviewForm.getReviewTitle()).isEqualTo(reviewFormTitle),
            () -> assertThat(savedReviewForm.getReviewFormQuestions())
                .usingRecursiveComparison()
                .ignoringFields("id")
                .isEqualTo(expected)
        );
    }

    @Test
    @DisplayName("개인이 작성한 회고를 조회한다.")
    void findMyReviewForms() {
        String reviewTitle1 = "title1";
        List<ReviewFormQuestionRequest> questions1 = List.of(new ReviewFormQuestionRequest("question1"),
            new ReviewFormQuestionRequest("question2"));

        ReviewFormCreateRequest createRequest1 = new ReviewFormCreateRequest(reviewTitle1, questions1);

        String reviewTitle2 = "title2";
        List<ReviewFormQuestionRequest> questions2 = List.of(new ReviewFormQuestionRequest("question3"),
            new ReviewFormQuestionRequest("question4"));

        ReviewFormCreateRequest createRequest2 = new ReviewFormCreateRequest(reviewTitle2, questions2);

        List<ReviewFormQuestion> expected = questions1.stream()
            .map(questionRequest -> new ReviewFormQuestion(questionRequest.getQuestionValue()))
            .collect(Collectors.toList());

        int index = 0;
        for (ReviewFormQuestion reviewFormQuestion : expected) {
            reviewFormQuestion.setPosition(index++);
        }

        // when
        reviewFormService.save(member1, createRequest1);
        reviewFormService.save(member2, createRequest2);

        List<ReviewForm> myReviewForms = reviewFormService.findByMember(member1);

        // then
        assertAll(
            () -> assertThat(myReviewForms).hasSize(1),
            () -> assertThat(myReviewForms.get(0)).isNotNull(),
            () -> assertThat(myReviewForms.get(0).getMember().getNickname()).isEqualTo("제이슨"),
            () -> assertThat(myReviewForms.get(0).getId()).isNotNull(),
            () -> assertThat(myReviewForms.get(0).getCode().length()).isEqualTo(8),
            () -> assertThat(myReviewForms.get(0).getReviewTitle()).isEqualTo(reviewTitle1),
            () -> assertThat(myReviewForms.get(0).getReviewFormQuestions())
                .usingRecursiveComparison()
                .ignoringFields("id")
                .isEqualTo(expected)
        );
    }

    private ReviewForm saveReviewForm(Member member) {
        List<ReviewFormQuestionRequest> createRequests = List.of(new ReviewFormQuestionRequest("question1"),
            new ReviewFormQuestionRequest("question2"));
        ReviewFormCreateRequest createRequest = new ReviewFormCreateRequest("title", createRequests);
        return reviewFormService.save(member, createRequest);
    }
}
