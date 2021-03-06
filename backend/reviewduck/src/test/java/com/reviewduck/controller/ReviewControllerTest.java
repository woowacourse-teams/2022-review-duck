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
import com.reviewduck.dto.request.ReviewRequest;
import com.reviewduck.service.ReviewService;

@WebMvcTest(ReviewController.class)
public class ReviewControllerTest {

    private final Long invalidReviewId = 1L;
    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private ObjectMapper objectMapper;
    @MockBean
    private ReviewService reviewService;

    @ParameterizedTest
    @NullAndEmptySource
    @DisplayName("회고 수정 시 닉네임에 빈 값이 들어갈 경우 예외가 발생한다.")
    void emptyNickNameInEditing(String nickname) throws Exception {
        // given
        ReviewRequest request = new ReviewRequest(nickname, List.of());

        // when, then
        assertBadRequestFromPut("/api/reviews/" + invalidReviewId, request, "닉네임은 비어있을 수 없습니다.");
    }

    @ParameterizedTest
    @NullSource
    @DisplayName("회고 수정 시 질문 번호에 null 값이 들어갈 경우 예외가 발생한다.")
    void nullQuestionIdRequestInEditing(Long questionId) throws Exception {
        // given
        ReviewRequest request = new ReviewRequest("제이슨", List.of(new AnswerRequest(questionId, "answer")));

        // when, then
        assertBadRequestFromPut("/api/reviews/" + invalidReviewId, request, "질문 번호는 비어있을 수 없습니다.");
    }

    @ParameterizedTest
    @NullSource
    @DisplayName("회고 수정 시 답변에 null 값이 들어갈 경우 예외가 발생한다.")
    void nullAnswerRequestInEditing(String answer) throws Exception {
        // given
        ReviewRequest request = new ReviewRequest("제이슨", List.of(new AnswerRequest(1L, answer)));

        // when, then
        assertBadRequestFromPut("/api/reviews/" + invalidReviewId, request, "답변은 비어있을 수 없습니다.");
    }

    @ParameterizedTest
    @NullSource
    @DisplayName("회고 수정 시 답변 목록에 null 값이 들어갈 경우 예외가 발생한다.")
    void nullAnswerRequestsInEditing(List<AnswerRequest> answers) throws Exception {
        // given
        ReviewRequest request = new ReviewRequest("제이슨", answers);

        // when, then
        assertBadRequestFromPut("/api/reviews/" + invalidReviewId, request, "회고 답변 관련 오류가 발생했습니다.");
    }

    private void assertBadRequestFromPut(String uri, Object request, String errorMessage) throws Exception {
        mockMvc.perform(put(uri)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request))
            ).andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.message", containsString(errorMessage)));
    }
}
