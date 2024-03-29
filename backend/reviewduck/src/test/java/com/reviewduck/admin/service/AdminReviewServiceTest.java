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

import com.reviewduck.admin.dto.response.AdminReviewInfoResponse;
import com.reviewduck.admin.dto.response.AdminReviewsResponse;
import com.reviewduck.common.exception.NotFoundException;
import com.reviewduck.member.domain.Member;
import com.reviewduck.member.repository.MemberRepository;
import com.reviewduck.member.service.MemberService;
import com.reviewduck.review.domain.Review;
import com.reviewduck.review.dto.controller.request.AnswerCreateRequest;
import com.reviewduck.review.dto.controller.request.ReviewContentCreateRequest;
import com.reviewduck.review.dto.controller.request.ReviewCreateRequest;
import com.reviewduck.review.dto.controller.request.ReviewFormCreateRequest;
import com.reviewduck.review.dto.controller.request.ReviewFormQuestionCreateRequest;
import com.reviewduck.review.service.ReviewFormService;
import com.reviewduck.review.service.ReviewService;

@SpringBootTest
@Sql("classpath:truncate.sql")
@Transactional
public class AdminReviewServiceTest {

    @Autowired
    private AdminReviewService adminReviewService;

    @Autowired
    private ReviewFormService reviewFormService;

    @Autowired
    private ReviewService reviewService;

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
    @DisplayName("회고를 모두 조회한다.")
    void findAllReviews() {
        // given
        saveReview(member1);
        saveReview(member2);

        // when
        AdminReviewsResponse reviewsResponse = adminReviewService.findAllReviews();

        List<AdminReviewInfoResponse> reviews = reviewsResponse.getReviews();

        // then
        assertAll(
            () -> assertThat(reviews).hasSize(2),
            () -> assertThat(reviews.get(0).getMemberId()).isEqualTo(member1.getId()),
            () -> assertThat(reviews.get(1).getMemberId()).isEqualTo(member2.getId())
        );
    }

    @Test
    @DisplayName("회고 폼을 삭제한다.")
    void deleteReviewForm() {
        // given
        long reviewId = saveReview(member1);

        // when
        adminReviewService.deleteReview(reviewId);

        // then
        assertThatThrownBy(() -> adminReviewService.findById(reviewId))
            .isInstanceOf(NotFoundException.class)
            .hasMessageContaining("존재하지 않는 회고입니다.");
    }

    @Test
    @DisplayName("존재하지 않는 회고 폼을 삭제할 수 없다.")
    void failToDeleteReviewForm() {
        // when, then
        assertThatThrownBy(() -> adminReviewService.deleteReview(9999L))
            .isInstanceOf(NotFoundException.class)
            .hasMessageContaining("존재하지 않는 회고입니다.");
    }

    private long saveReview(Member member) {
        ReviewCreateRequest createRequest = new ReviewCreateRequest(false, "title", List.of(
            new ReviewContentCreateRequest(1L, new AnswerCreateRequest("answer1")),
            new ReviewContentCreateRequest(2L, new AnswerCreateRequest("answer2"))
        ));

        String reviewTitle = "title";
        List<ReviewFormQuestionCreateRequest> questions = List.of(
            new ReviewFormQuestionCreateRequest("question1", "description1"),
            new ReviewFormQuestionCreateRequest("question2", "description2"));
        ReviewFormCreateRequest reviewFormCreateRequest = new ReviewFormCreateRequest(reviewTitle, questions);
        String reviewFormCode = reviewFormService.save(member1.getId(), reviewFormCreateRequest).getReviewFormCode();

        return reviewService.save(member.getId(), reviewFormCode, createRequest);
    }
}
