package com.reviewduck.admin.service;

import static org.assertj.core.api.Assertions.*;
import static org.junit.jupiter.api.Assertions.*;

import java.util.List;

import javax.transaction.Transactional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.jdbc.Sql;

import com.reviewduck.common.exception.NotFoundException;
import com.reviewduck.member.domain.Member;
import com.reviewduck.member.service.MemberService;
import com.reviewduck.review.domain.ReviewForm;
import com.reviewduck.review.dto.request.ReviewFormCreateRequest;
import com.reviewduck.review.dto.request.ReviewFormQuestionCreateRequest;
import com.reviewduck.review.service.ReviewFormService;

@SpringBootTest
@Sql("classpath:truncate.sql")
@Transactional
public class AdminReviewFormServiceTest {

    @Autowired
    private AdminReviewFormService adminReviewFormService;

    @Autowired
    private ReviewFormService reviewFormService;

    @Autowired
    private MemberService memberService;

    private Member member1;
    private Member member2;

    @BeforeEach
    void setUp() {
        Member tempMember1 = new Member("1", "jason", "제이슨", "testUrl1");
        member1 = memberService.save(tempMember1);

        Member tempMember2 = new Member("2", "woni", "워니", "testUrl2");
        member2 = memberService.save(tempMember2);
    }

    @Test
    @DisplayName("회고 폼을 모두 조회한다.")
    void findAllReviewForms() {
        // given
        saveReviewForm(member1);
        saveReviewForm(member2);

        // when
        List<ReviewForm> reviewForms = adminReviewFormService.findAllReviewForms();

        // then
        assertAll(
            () -> assertThat(reviewForms).hasSize(2),
            () -> assertThat(reviewForms.get(0).getMember()).isEqualTo(member1),
            () -> assertThat(reviewForms.get(1).getMember()).isEqualTo(member2)
        );
    }

    @Test
    @DisplayName("회고 폼을 삭제한다.")
    void deleteReviewForm() {
        // given
        ReviewForm reviewForm = saveReviewForm(member1);

        // when
        adminReviewFormService.deleteReviewFormById(reviewForm.getId());

        // then
        assertThatThrownBy(() -> reviewFormService.findByCode(reviewForm.getCode()))
            .isInstanceOf(NotFoundException.class)
            .hasMessageContaining("존재하지 않는 회고 폼입니다.");
    }

    @Test
    @DisplayName("존재하지 않는 회고 폼을 삭제할 수 없다.")
    void failToDeleteReviewForm() {
        // when, then
        assertThatThrownBy(() -> adminReviewFormService.deleteReviewFormById(9999L))
            .isInstanceOf(NotFoundException.class)
            .hasMessageContaining("존재하지 않는 회고 폼입니다.");
    }

    private ReviewForm saveReviewForm(Member member) {
        List<ReviewFormQuestionCreateRequest> createRequests = List.of(
            new ReviewFormQuestionCreateRequest("question1"),
            new ReviewFormQuestionCreateRequest("question2"));

        ReviewFormCreateRequest createRequest = new ReviewFormCreateRequest("title", createRequests);

        return reviewFormService.save(member, createRequest);
    }
}
