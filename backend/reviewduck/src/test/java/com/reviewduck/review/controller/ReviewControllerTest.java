package com.reviewduck.review.controller;

import static org.hamcrest.Matchers.*;
import static org.mockito.BDDMockito.any;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.List;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.NullSource;
import org.springframework.http.MediaType;

import com.reviewduck.common.controller.ControllerTest;
import com.reviewduck.review.dto.controller.request.AnswerUpdateRequest;
import com.reviewduck.review.dto.controller.request.ReviewContentUpdateRequest;
import com.reviewduck.review.dto.controller.request.ReviewLikesRequest;
import com.reviewduck.review.dto.controller.request.ReviewUpdateRequest;

public class ReviewControllerTest extends ControllerTest {

    @Nested
    @DisplayName("회고 수정 시")
    class updateReview {

        @ParameterizedTest
        @NullSource
        @DisplayName("회고 제목에 null 값이 들어갈 경우 예외가 발생한다.")
        void nullTitle(String title) throws Exception {
            // given
            ReviewUpdateRequest request = new ReviewUpdateRequest(false, title, List.of(
                new ReviewContentUpdateRequest(1L, new AnswerUpdateRequest("answer")))
            );

            // when, then
            assertBadRequestFromPut("/api/reviews/" + INVALID_REVIEW_ID, request, "회고 제목은 비어있을 수 없습니다.");
        }

        @ParameterizedTest
        @NullSource
        @DisplayName("회고 공개 여부에 null 값이 들어갈 경우 예외가 발생한다.")
        void nullIsPrivate(Boolean isPrivate) throws Exception {
            // given
            ReviewUpdateRequest request = new ReviewUpdateRequest(isPrivate, "title", List.of(
                new ReviewContentUpdateRequest(1L, new AnswerUpdateRequest("answer")))
            );

            // when, then
            assertBadRequestFromPut("/api/reviews/" + INVALID_REVIEW_ID, request, "공개 여부를 설정해야 합니다.");
        }

        @ParameterizedTest
        @NullSource
        @DisplayName("회고 내용에 null 값이 들어갈 경우 예외가 발생한다.")
        void nullContent(List<ReviewContentUpdateRequest> contents) throws Exception {
            // given
            ReviewUpdateRequest request = new ReviewUpdateRequest(false, "title", contents);

            // when, then
            assertBadRequestFromPut("/api/reviews/" + INVALID_REVIEW_ID, request, "회고 답변 관련 오류가 발생했습니다.");
        }

        @ParameterizedTest
        @NullSource
        @DisplayName("질문 번호에 null 값이 들어갈 경우 예외가 발생한다.")
        void nullQuestionId(Long questionId) throws Exception {
            // given
            ReviewUpdateRequest request = new ReviewUpdateRequest(false, "title", List.of(
                new ReviewContentUpdateRequest(questionId, new AnswerUpdateRequest("answer"))
            ));

            // when, then
            assertBadRequestFromPut("/api/reviews/" + INVALID_REVIEW_ID, request, "질문 번호는 비어있을 수 없습니다.");
        }

        @ParameterizedTest
        @NullSource
        @DisplayName("답변에 null 값이 들어갈 경우 예외가 발생한다.")
        void nullAnswerUpdateRequest(AnswerUpdateRequest answer) throws Exception {
            // given
            ReviewUpdateRequest request = new ReviewUpdateRequest(false, "title", List.of(
                new ReviewContentUpdateRequest(1L, answer)
            ));

            // when, then
            assertBadRequestFromPut("/api/reviews/" + INVALID_REVIEW_ID, request, "회고 답변 생성 중 오류가 발생했습니다.");
        }

        @ParameterizedTest
        @NullSource
        @DisplayName("답변 값에 null 값이 들어갈 경우 예외가 발생한다.")
        void nullAnswer(String answer) throws Exception {
            // given
            ReviewUpdateRequest request = new ReviewUpdateRequest(false, "title", List.of(
                new ReviewContentUpdateRequest(1L, new AnswerUpdateRequest(answer))
            ));

            // when, then
            assertBadRequestFromPut("/api/reviews/" + INVALID_REVIEW_ID, request, "답변은 비어있을 수 없습니다.");
        }

    }

    @Nested
    @DisplayName("좋아요")
    class likes {

        @Test
        @DisplayName("좋아요 개수는 음수일 수 없다.")
        void notNegative() throws Exception {
            // given
            ReviewLikesRequest request = new ReviewLikesRequest(-1);

            // when, then
            assertBadRequestFromPost("/api/reviews/1/likes", request, "좋아요 개수는 0 이상이어야 합니다.");
        }

    }

    private void assertBadRequestFromPost(String uri, Object request, String errorMessage) throws
        Exception {
        mockMvc.perform(post(uri)
                .header("Authorization", "Bearer " + ACCESS_TOKEN)
                .contentType(MediaType.APPLICATION_JSON)
                .characterEncoding("UTF-8")
                .content(objectMapper.writeValueAsString(request))
            ).andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.message", containsString(errorMessage)));
    }

    private void assertBadRequestFromPut(String uri, Object request, String errorMessage) throws Exception {
        mockMvc.perform(put(uri)
                .header("Authorization", "Bearer " + ACCESS_TOKEN)
                .contentType(MediaType.APPLICATION_JSON)
                .characterEncoding("UTF-8")
                .content(objectMapper.writeValueAsString(request))
            ).andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.message", containsString(errorMessage)));
    }
}
