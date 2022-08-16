package com.reviewduck.review.controller;

import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.NullAndEmptySource;
import org.junit.jupiter.params.provider.NullSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.reviewduck.auth.support.JwtTokenProvider;
import com.reviewduck.member.domain.Member;
import com.reviewduck.member.service.MemberService;
import com.reviewduck.review.dto.request.AnswerCreateRequest;
import com.reviewduck.review.dto.request.ReviewContentCreateRequest;
import com.reviewduck.review.dto.request.ReviewCreateRequest;
import com.reviewduck.review.dto.request.ReviewFormCreateRequest;
import com.reviewduck.review.dto.request.ReviewFormQuestionCreateRequest;
import com.reviewduck.review.dto.request.ReviewFormQuestionUpdateRequest;
import com.reviewduck.review.dto.request.ReviewFormUpdateRequest;
import com.reviewduck.review.service.ReviewFormService;
import com.reviewduck.review.service.ReviewService;

@WebMvcTest(ReviewFormController.class)
public class ReviewFormControllerTest {

    private static final String accessToken = "access_token";
    private static final String invalidCode = "aaaaaaaa";

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private ReviewFormService reviewFormService;

    @MockBean
    private ReviewService reviewService;

    @MockBean
    private JwtTokenProvider jwtTokenProvider;

    @MockBean
    private MemberService memberService;

    @BeforeEach
    void createMemberAndGetAccessToken() {
        Member member = new Member("1", "jason", "제이슨", "profileUrl");
        given(jwtTokenProvider.getPayload(any())).willReturn("1");
        given(memberService.findById(any())).willReturn(member);
    }

    @Nested
    @DisplayName("회고 폼 생성시")
    class createReviewForm {

        @ParameterizedTest
        @NullAndEmptySource
        @DisplayName("회고 제목에 빈 값이 들어갈 경우 예외가 발생한다.")
        void emptyReviewTitle(String title) throws Exception {
            // given
            ReviewFormCreateRequest request = new ReviewFormCreateRequest(title, List.of());

            // when, then
            assertBadRequestFromPost("/api/review-forms", request, "회고 폼의 제목은 비어있을 수 없습니다.");
        }

        @ParameterizedTest
        @NullSource
        @DisplayName("질문 목록에 null 값이 들어갈 경우 예외가 발생한다.")
        void nullQuestionList(List<ReviewFormQuestionCreateRequest> questions) throws Exception {
            // given
            ReviewFormCreateRequest request = new ReviewFormCreateRequest("title", questions);

            // when, then
            assertBadRequestFromPost("/api/review-forms", request, "회고 폼의 질문 목록 생성 중 오류가 발생했습니다.");
        }

        @ParameterizedTest
        @NullAndEmptySource
        @DisplayName("회고 질문에 빈 값이 들어갈 경우 예외가 발생한다.")
        void emptyQuestionValue(String question) throws Exception {
            // given
            ReviewFormCreateRequest request = new ReviewFormCreateRequest("title",
                List.of(new ReviewFormQuestionCreateRequest(question)));

            // when, then
            assertBadRequestFromPost("/api/review-forms", request, "회고 폼의 질문은 비어있을 수 없습니다.");
        }

    }

    @Nested
    @DisplayName("회고 답변 생성시")
    class createReview {

        @ParameterizedTest
        @NullSource
        @DisplayName("회고 내용에 null 값이 들어갈 경우 예외가 발생한다.")
        void nullReviewContent(List<ReviewContentCreateRequest> review) throws Exception {
            ReviewCreateRequest request = new ReviewCreateRequest(review);

            // when, then
            assertBadRequestFromPost("/api/review-forms/" + invalidCode, request, "회고 내용은 비어있을 수 없습니다.");

        }

        @ParameterizedTest
        @NullSource
        @DisplayName("질문 번호에 null 값이 들어갈 경우 예외가 발생한다.")
        void nullQuestionId(Long questionId) throws Exception {
            // given
            ReviewCreateRequest request = new ReviewCreateRequest(List.of(
                new ReviewContentCreateRequest(questionId, new AnswerCreateRequest("answer1"))
            ));

            // when, then
            assertBadRequestFromPost("/api/review-forms/" + invalidCode, request, "질문 번호는 비어있을 수 없습니다.");
        }

        @ParameterizedTest
        @NullSource
        @DisplayName("답변에 null 값이 들어갈 경우 예외가 발생한다.")
        void nullAnswerRequest(AnswerCreateRequest answer) throws Exception {
            // given
            ReviewCreateRequest request = new ReviewCreateRequest(List.of(
                new ReviewContentCreateRequest(1L, answer)
            ));

            // when, then
            assertBadRequestFromPost("/api/review-forms/" + invalidCode, request, "회고 답변 생성 중 오류가 발생했습니다.");
        }

        @ParameterizedTest
        @NullSource
        @DisplayName("답변 값에 null 값이 들어갈 경우 예외가 발생한다.")
        void nullAnswer(String answer) throws Exception {
            // given
            ReviewCreateRequest request = new ReviewCreateRequest(List.of(
                new ReviewContentCreateRequest(1L, new AnswerCreateRequest(answer))
            ));
            // when, then
            assertBadRequestFromPost("/api/review-forms/" + invalidCode, request, "답변은 비어있을 수 없습니다.");
        }

    }

    @Nested
    @DisplayName("회고 폼 수정시")
    class updateReviewForm {

        @ParameterizedTest
        @NullAndEmptySource
        @DisplayName("회고 제목에 빈 값이 들어갈 경우 예외가 발생한다.")
        void emptyReviewTitle(String title) throws Exception {
            // given
            ReviewFormUpdateRequest request = new ReviewFormUpdateRequest(title, List.of());

            // when, then
            assertBadRequestFromPut("/api/review-forms/" + invalidCode, request, "회고 폼의 제목은 비어있을 수 없습니다.");
        }

        @ParameterizedTest
        @NullSource
        @DisplayName("질문 목록에 null 값이 들어갈 경우 예외가 발생한다.")
        void nullQuestions(List<ReviewFormQuestionUpdateRequest> questions) throws Exception {
            // given
            ReviewFormUpdateRequest request = new ReviewFormUpdateRequest("new title", questions);

            // when, then
            assertBadRequestFromPut("/api/review-forms/" + invalidCode, request, "회고 폼의 질문 목록 수정 중 오류가 발생했습니다.");
        }

        @ParameterizedTest
        @NullSource
        @DisplayName("질문이 비어있을 경우 예외가 발생한다.")
        void emptyQuestionValue(String questionValue) throws Exception {
            // given
            ReviewFormUpdateRequest request = new ReviewFormUpdateRequest("new title",
                List.of(new ReviewFormQuestionUpdateRequest(1L, questionValue)));

            // when, then
            assertBadRequestFromPut("/api/review-forms/" + invalidCode, request, "회고 폼의 질문은 비어있을 수 없습니다.");
        }

    }

    private void assertBadRequestFromPost(String uri, Object request, String errorMessage) throws Exception {
        mockMvc.perform(post(uri)
                .header("Authorization", "Bearer " + accessToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request))
            ).andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.message", containsString(errorMessage)));
    }

    private void assertBadRequestFromPut(String uri, Object request, String errorMessage) throws Exception {
        mockMvc.perform(put(uri)
                .header("Authorization", "Bearer " + accessToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request))
            ).andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.message", containsString(errorMessage)));
    }
}
