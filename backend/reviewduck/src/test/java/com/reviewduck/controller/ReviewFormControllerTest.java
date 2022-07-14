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
import com.reviewduck.dto.request.QuestionRequest;
import com.reviewduck.dto.request.QuestionUpdateRequest;
import com.reviewduck.dto.request.ReviewFormCreateRequest;
import com.reviewduck.dto.request.ReviewFormUpdateRequest;
import com.reviewduck.service.ReviewFormService;

@WebMvcTest(ReviewFormController.class)
public class ReviewFormControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private ReviewFormService reviewFormService;

    @ParameterizedTest
    @NullAndEmptySource
    @DisplayName("회고 생성시 회고 제목에 빈 값이 들어갈 경우 예외가 발생한다.")
    void createWithEmptyReviewTitle(String title) throws Exception {
        // given
        ReviewFormCreateRequest request = new ReviewFormCreateRequest(title, List.of());

        // when, then
        assertBadRequestFromPost("/api/review-forms", request, "회고 폼의 제목은 비어있을 수 없습니다.");
    }

    @ParameterizedTest
    @NullSource
    @DisplayName("회고 생성시 회고 질문 목록에 null 값이 들어갈 경우 예외가 발생한다.")
    void createWithNullQuestionList(List<QuestionRequest> questions) throws Exception {
        // given
        ReviewFormCreateRequest request = new ReviewFormCreateRequest("title", questions);

        // when, then
        assertBadRequestFromPost("/api/review-forms", request, "회고 폼의 질문 목록 생성 중 오류가 발생했습니다.");
    }

    @ParameterizedTest
    @NullAndEmptySource
    @DisplayName("회고 수정시 회고 제목에 빈 값이 들어갈 경우 예외가 발생한다.")
    void updateWithEmptyReviewTitle(String title) throws Exception {
        // given
        ReviewFormUpdateRequest request = new ReviewFormUpdateRequest(title, List.of());

        // when, then
        assertBadRequestFromPut("/api/review-forms/aaaaaaaa", request, "회고 폼의 제목은 비어있을 수 없습니다.");
    }

    @ParameterizedTest
    @NullSource
    @DisplayName("회고 수정시 질문 목록에 null 값이 들어갈 경우 예외가 발생한다.")
    void updateWithNullQuestions(List<QuestionUpdateRequest> questions) throws Exception {
        // given
        ReviewFormUpdateRequest request = new ReviewFormUpdateRequest("new title", questions);

        // when, then
        assertBadRequestFromPut("/api/review-forms/aaaaaaaa", request, "회고 폼의 질문 목록 수정 중 오류가 발생했습니다.");
    }

    @ParameterizedTest
    @NullSource
    @DisplayName("회고 수정시 회고 질문에 null 값이 들어갈 경우 예외가 발생한다.")
    void updateWithEmptyQuestionValue(String questionValue) throws Exception {
        // given
        ReviewFormUpdateRequest request = new ReviewFormUpdateRequest("new title",
            List.of(new QuestionUpdateRequest(1L, questionValue)));

        // when, then
        assertBadRequestFromPut("/api/review-forms/aaaaaaaa", request, "회고 폼의 질문 수정 중 오류가 발생했습니다.");
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
