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

import com.reviewduck.admin.dto.response.AdminReviewFormInfoResponse;
import com.reviewduck.admin.dto.response.AdminReviewFormsResponse;
import com.reviewduck.common.exception.NotFoundException;
import com.reviewduck.member.domain.Member;
import com.reviewduck.member.repository.MemberRepository;
import com.reviewduck.member.service.MemberService;
import com.reviewduck.review.domain.ReviewForm;
import com.reviewduck.review.dto.controller.request.ReviewFormCreateRequest;
import com.reviewduck.review.dto.controller.request.ReviewFormQuestionCreateRequest;
import com.reviewduck.review.dto.controller.response.ReviewFormCodeResponse;
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
    private MemberRepository memberRepository;

    private Member member1;
    private Member member2;

    @BeforeEach
    void setUp() {
        Member tempMember1 = new Member("1", "jason", "제이슨", "testUrl1");
        member1 = memberRepository.save(tempMember1);

        Member tempMember2 = new Member("2", "woni", "워니", "testUrl2");
        member2 = memberRepository.save(tempMember2);
    }

    @Test
    @DisplayName("회고 폼을 모두 조회한다.")
    void findAllReviewForms() {
        // given
        saveReviewForm(member1);
        saveReviewForm(member2);

        // when
        AdminReviewFormsResponse reviewFormsResponse = adminReviewFormService.findAllReviewForms();

        List<AdminReviewFormInfoResponse> reviewForms = reviewFormsResponse.getReviewForms();

        // then
        assertAll(
            () -> assertThat(reviewForms).hasSize(2),
            () -> assertThat(reviewForms.get(0).getMemberId()).isEqualTo(member1.getId()),
            () -> assertThat(reviewForms.get(1).getMemberId()).isEqualTo(member2.getId())
        );
    }

    @Test
    @DisplayName("회고 폼을 삭제한다.")
    void deleteReviewForm() {
        // given
        String reviewFormCode = saveReviewForm(member1).getReviewFormCode();
        long reviewFormId = adminReviewFormService.findByCode(reviewFormCode).getId();

        // when
        adminReviewFormService.deleteReviewForm(reviewFormId);

        // then
        assertThatThrownBy(() -> reviewFormService.findByCode(reviewFormCode, member1.getId()))
            .isInstanceOf(NotFoundException.class)
            .hasMessageContaining("존재하지 않는 회고 폼입니다.");
    }

    @Test
    @DisplayName("존재하지 않는 회고 폼을 삭제할 수 없다.")
    void failToDeleteReviewForm() {
        // when, then
        assertThatThrownBy(() -> adminReviewFormService.deleteReviewForm(9999L))
            .isInstanceOf(NotFoundException.class)
            .hasMessageContaining("존재하지 않는 회고 폼입니다.");
    }

    private ReviewFormCodeResponse saveReviewForm(Member member) {
        List<ReviewFormQuestionCreateRequest> createRequests = List.of(
            new ReviewFormQuestionCreateRequest("question1", "description1"),
            new ReviewFormQuestionCreateRequest("question2", "description2"));

        ReviewFormCreateRequest createRequest = new ReviewFormCreateRequest("title", createRequests);

        return reviewFormService.save(member.getId(), createRequest);
    }
}
