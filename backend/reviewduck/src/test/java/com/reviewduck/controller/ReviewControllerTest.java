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
import com.reviewduck.dto.request.ReviewCreateRequest;
import com.reviewduck.service.ReviewFormService;
import com.reviewduck.service.ReviewService;

@WebMvcTest(ReviewController.class)
public class ReviewControllerTest {

    private final String invalidCode = "aaaaaaaa";
    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private ObjectMapper objectMapper;
    @MockBean
    private ReviewService reviewService;
    @MockBean
    private ReviewFormService reviewFormService;

    @ParameterizedTest
    @NullAndEmptySource
    @DisplayName("닉네임에 빈 값이 들어갈 경우 예외가 발생한다.")
    void emptyNickName(String nickname) throws Exception {
        // given
        ReviewCreateRequest request = new ReviewCreateRequest(nickname, List.of());

        // when, then
        assertBadRequestFromPost("/api/review-forms/" + invalidCode, request, "닉네임은 비어있을 수 없습니다.");
    }

    @ParameterizedTest
    @NullSource
    @DisplayName("질문 번호에 null 값이 들어갈 경우 예외가 발생한다.")
    void nullQuestionIdRequest(Long questionId) throws Exception {
        // given
        ReviewCreateRequest request = new ReviewCreateRequest("제이슨", List.of(new AnswerRequest(questionId, "answer")));

        // when, then
        assertBadRequestFromPost("/api/review-forms/" + invalidCode, request, "질문 번호는 비어있을 수 없습니다.");
    }

    @ParameterizedTest
    @NullSource
    @DisplayName("답변에 null 값이 들어갈 경우 예외가 발생한다.")
    void nullAnswerRequest(String answer) throws Exception {
        // given
        ReviewCreateRequest request = new ReviewCreateRequest("제이슨", List.of(new AnswerRequest(1L, answer)));

        // when, then
        assertBadRequestFromPost("/api/review-forms/" + invalidCode, request, "답변은 비어있을 수 없습니다.");
    }

    @ParameterizedTest
    @NullSource
    @DisplayName("답변 목록에 null 값이 들어갈 경우 예외가 발생한다.")
    void nullAnswerRequests(List<AnswerRequest> answers) throws Exception {
        // given
        ReviewCreateRequest request = new ReviewCreateRequest("제이슨", answers);

        // when, then
        assertBadRequestFromPost("/api/review-forms/" + invalidCode, request, "회고 작성 중 오류가 발생했습니다.");
    }

    private void assertBadRequestFromPost(String uri, Object request, String errorMessage) throws Exception {
        mockMvc.perform(post(uri)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request))
            ).andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.message", containsString(errorMessage)));
    }
}
