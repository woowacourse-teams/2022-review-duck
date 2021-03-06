package com.reviewduck.controller;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.List;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.NullAndEmptySource;
import org.junit.jupiter.params.provider.NullSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.reviewduck.dto.request.AnswerRequest;
import com.reviewduck.dto.request.QuestionRequest;
import com.reviewduck.dto.request.QuestionUpdateRequest;
import com.reviewduck.dto.request.ReviewFormCreateRequest;
import com.reviewduck.dto.request.ReviewFormUpdateRequest;
import com.reviewduck.dto.request.ReviewRequest;
import com.reviewduck.service.ReviewFormService;
import com.reviewduck.service.ReviewService;

@WebMvcTest(ReviewFormController.class)
public class ReviewFormControllerTest {
    private final String invalidCode = "aaaaaaaa";

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private ReviewFormService reviewFormService;

    @MockBean
    private ReviewService reviewService;

    @ParameterizedTest
    @NullAndEmptySource
    @DisplayName("회고 폼 생성시 회고 제목에 빈 값이 들어갈 경우 예외가 발생한다.")
    void createWithEmptyReviewTitle(String title) throws Exception {
        // given
        ReviewFormCreateRequest request = new ReviewFormCreateRequest(title, List.of());

        // when, then
        assertBadRequestFromPost("/api/review-forms", request, "회고 폼의 제목은 비어있을 수 없습니다.");
    }

    @ParameterizedTest
    @NullSource
    @DisplayName("회고 폼 생성시 회고 질문 목록에 null 값이 들어갈 경우 예외가 발생한다.")
    void createWithNullQuestionList(List<QuestionRequest> questions) throws Exception {
        // given
        ReviewFormCreateRequest request = new ReviewFormCreateRequest("title", questions);

        // when, then
        assertBadRequestFromPost("/api/review-forms", request, "회고 폼의 질문 목록 생성 중 오류가 발생했습니다.");
    }

    @ParameterizedTest
    @NullAndEmptySource
    @DisplayName("회고 폼 수정시 회고 제목에 빈 값이 들어갈 경우 예외가 발생한다.")
    void updateWithEmptyReviewTitle(String title) throws Exception {
        // given
        ReviewFormUpdateRequest request = new ReviewFormUpdateRequest(title, List.of());

        // when, then
        assertBadRequestFromPut("/api/review-forms/aaaaaaaa", request, "회고 폼의 제목은 비어있을 수 없습니다.");
    }

    @ParameterizedTest
    @NullSource
    @DisplayName("회고 폼 수정시 질문 목록에 null 값이 들어갈 경우 예외가 발생한다.")
    void updateWithNullQuestions(List<QuestionUpdateRequest> questions) throws Exception {
        // given
        ReviewFormUpdateRequest request = new ReviewFormUpdateRequest("new title", questions);

        // when, then
        assertBadRequestFromPut("/api/review-forms/aaaaaaaa", request, "회고 폼의 질문 목록 수정 중 오류가 발생했습니다.");
    }

    @ParameterizedTest
    @NullSource
    @DisplayName("회고 폼 수정시 회고 질문에 null 값이 들어갈 경우 예외가 발생한다.")
    void updateWithEmptyQuestionValue(String questionValue) throws Exception {
        // given
        ReviewFormUpdateRequest request = new ReviewFormUpdateRequest("new title",
            List.of(new QuestionUpdateRequest(1L, questionValue)));

        // when, then
        assertBadRequestFromPut("/api/review-forms/aaaaaaaa", request, "회고 폼의 질문 수정 중 오류가 발생했습니다.");
    }

    @ParameterizedTest
    @NullAndEmptySource
    @DisplayName("회고 생성 시 닉네임에 빈 값이 들어갈 경우 예외가 발생한다.")
    void emptyNickNameInCreation(String nickname) throws Exception {
        // given
        ReviewRequest request = new ReviewRequest(nickname, List.of());

        // when, then
        assertBadRequestFromPost("/api/review-forms/" + invalidCode, request, "닉네임은 비어있을 수 없습니다.");
    }

    @ParameterizedTest
    @NullSource
    @DisplayName("회고 생성 시 질문 번호에 null 값이 들어갈 경우 예외가 발생한다.")
    void nullQuestionIdRequestInCreation(Long questionId) throws Exception {
        // given
        ReviewRequest request = new ReviewRequest("제이슨", List.of(new AnswerRequest(questionId, "answer")));

        // when, then
        assertBadRequestFromPost("/api/review-forms/" + invalidCode, request, "질문 번호는 비어있을 수 없습니다.");
    }

    @ParameterizedTest
    @NullSource
    @DisplayName("회고 생성 시 답변에 null 값이 들어갈 경우 예외가 발생한다.")
    void nullAnswerRequestInCreation(String answer) throws Exception {
        // given
        ReviewRequest request = new ReviewRequest("제이슨", List.of(new AnswerRequest(1L, answer)));

        // when, then
        assertBadRequestFromPost("/api/review-forms/" + invalidCode, request, "답변은 비어있을 수 없습니다.");
    }

    @ParameterizedTest
    @NullSource
    @DisplayName("회고 생성 시 답변 목록에 null 값이 들어갈 경우 예외가 발생한다.")
    void nullAnswerRequestsInCreation(List<AnswerRequest> answers) throws Exception {
        // given
        ReviewRequest request = new ReviewRequest("제이슨", answers);

        // when, then
        assertBadRequestFromPost("/api/review-forms/" + invalidCode, request, "회고 답변 관련 오류가 발생했습니다.");
    }

    private void assertBadRequestFromPost(String uri, Object request, String errorMessage) throws Exception {
        mockMvc.perform(post(uri)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request))
            ).andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.message", containsString(errorMessage)));
    }

    private void assertBadRequestFromPut(String uri, Object request, String errorMessage) throws Exception {
        mockMvc.perform(put(uri)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request))
            ).andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.message", containsString(errorMessage)));
    }
}
