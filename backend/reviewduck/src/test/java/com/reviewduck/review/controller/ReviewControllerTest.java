package com.reviewduck.review.controller;

import static org.hamcrest.Matchers.*;
import static org.mockito.BDDMockito.any;
import static org.mockito.BDDMockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.params.ParameterizedTest;
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
import com.reviewduck.review.dto.request.AnswerUpdateRequest;
import com.reviewduck.review.dto.request.ReviewUpdateRequest;
import com.reviewduck.review.service.ReviewService;

@WebMvcTest(ReviewController.class)
public class ReviewControllerTest {

    private static final String accessToken = "access_token";
    private static final Long invalidReviewId = 1L;

    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private ObjectMapper objectMapper;
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

    @ParameterizedTest
    @NullSource
    @DisplayName("회고 수정 시 답변 번호에 null 값이 들어갈 경우 예외가 발생한다.")
    void nullQuestionIdRequestInEditing(Long answerId) throws Exception {
        // given
        ReviewUpdateRequest request = new ReviewUpdateRequest(
            List.of(new AnswerUpdateRequest(answerId, "editedAnswer1")));

        // when, then
        assertBadRequestFromPut("/api/reviews/" + invalidReviewId, request, "답변 번호는 비어있을 수 없습니다.");
    }

    @ParameterizedTest
    @NullSource
    @DisplayName("회고 수정 시 답변에 null 값이 들어갈 경우 예외가 발생한다.")
    void nullAnswerRequestInEditing(String answer) throws Exception {
        // given
        ReviewUpdateRequest request = new ReviewUpdateRequest(
            List.of(new AnswerUpdateRequest(1L, answer)));

        // when, then
        assertBadRequestFromPut("/api/reviews/" + invalidReviewId, request, "답변은 비어있을 수 없습니다.");
    }

    @ParameterizedTest
    @NullSource
    @DisplayName("회고 수정 시 답변 목록에 null 값이 들어갈 경우 예외가 발생한다.")
    void nullAnswerRequestsInEditing(List<AnswerUpdateRequest> answers) throws Exception {
        // given
        ReviewUpdateRequest request = new ReviewUpdateRequest(answers);

        // when, then
        assertBadRequestFromPut("/api/reviews/" + invalidReviewId, request, "회고 답변 관련 오류가 발생했습니다.");
    }

    private void assertBadRequestFromPut(String uri, Object request, String errorMessage) throws Exception {
        mockMvc.perform(put(uri)
                .header("Authorization", "Bearer " + accessToken)
                .contentType(MediaType.APPLICATION_JSON)
                .characterEncoding("UTF-8")
                .content(objectMapper.writeValueAsString(request))
            ).andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.message", containsString(errorMessage)));
    }
}
