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
import com.reviewduck.dto.request.ReviewFormCreateRequest;
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
    @DisplayName("회고 제목에 빈 값이 들어갈 경우 예외가 발생한다.")
    void emptyReviewTitle(String title) throws Exception {
        // given
        ReviewFormCreateRequest request = new ReviewFormCreateRequest(title, List.of());

        // when, then
        assertBadRequestFromPost("/api/review-forms", request, "회고 폼의 제목은 비어있을 수 없습니다.");
    }

    @ParameterizedTest
    @NullSource
    @DisplayName("회고 질문 목록에 null 값이 들어갈 경우 예외가 발생한다.")
    void nullQuestionList(List<QuestionRequest> questions) throws Exception {
        // given
        ReviewFormCreateRequest request = new ReviewFormCreateRequest("title", questions);

        // when, then
        assertBadRequestFromPost("/api/review-forms", request, "회고 폼의 질문 목록 생성 중 오류가 발생했습니다.");
    }

    private void assertBadRequestFromPost(String uri, Object request, String errorMessage) throws Exception {
        mockMvc.perform(post(uri)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request))
            ).andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.message", containsString(errorMessage)));
    }
}
