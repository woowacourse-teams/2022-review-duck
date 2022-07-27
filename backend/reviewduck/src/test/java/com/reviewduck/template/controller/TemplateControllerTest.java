package com.reviewduck.template.controller;

import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.List;

import org.junit.jupiter.api.BeforeEach;
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
import com.reviewduck.auth.service.AuthService;
import com.reviewduck.member.domain.Member;
import com.reviewduck.member.service.MemberService;
import com.reviewduck.review.dto.request.ReviewFormCreateFromTemplateRequest;
import com.reviewduck.review.service.ReviewFormService;
import com.reviewduck.template.dto.request.TemplateCreateRequest;
import com.reviewduck.template.dto.request.TemplateQuestionRequest;
import com.reviewduck.template.dto.request.TemplateQuestionUpdateRequest;
import com.reviewduck.template.dto.request.TemplateUpdateRequest;
import com.reviewduck.template.service.TemplateService;

@WebMvcTest(TemplateController.class)
public class TemplateControllerTest {

    private static final String accessToken = "access_token";

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private TemplateService TemplateService;

    @MockBean
    private ReviewFormService reviewFormService;

    @MockBean
    private AuthService authService;

    @MockBean
    private MemberService memberService;

    @BeforeEach
    void createMemberAndGetAccessToken() {
        Member member = new Member("panda", "제이슨", "profileUrl");
        given(authService.getPayload(any())).willReturn("1");
        given(memberService.findById(any())).willReturn(member);
    }

    @ParameterizedTest
    @NullAndEmptySource
    @DisplayName("템플릿 생성시 회고 제목에 빈 값이 들어갈 경우 예외가 발생한다.")
    void createWithEmptyReviewTitle(String title) throws Exception {
        // given
        TemplateCreateRequest request = new TemplateCreateRequest(title, "description", List.of());

        // when, then
        assertBadRequestFromPost("/api/templates", request, "템플릿의 제목은 비어있을 수 없습니다.");
    }

    @ParameterizedTest
    @NullSource
    @DisplayName("템플릿 생성시 회고 질문 목록에 null 값이 들어갈 경우 예외가 발생한다.")
    void createWithNullQuestionList(List<TemplateQuestionRequest> questions) throws Exception {
        // given
        TemplateCreateRequest request = new TemplateCreateRequest("title", "description", questions);

        // when, then
        assertBadRequestFromPost("/api/templates", request, "템플릿의 질문 목록 생성 중 오류가 발생했습니다.");
    }

    @ParameterizedTest
    @NullAndEmptySource
    @DisplayName("템플릿 기반으로 회고 폼 생성시 회고 폼 제목에 빈 값이 들어갈 경우 예외가 발생한다.")
    void createFromTemplateWithEmptyReviewTitle(String title) throws Exception {
        // given
        ReviewFormCreateFromTemplateRequest request = new ReviewFormCreateFromTemplateRequest(title);

        // when, then
        assertBadRequestFromPost("/api/templates/9999/review-forms", request, "회고 폼의 제목은 비어있을 수 없습니다.");
    }

    @ParameterizedTest
    @NullAndEmptySource
    @DisplayName("템플릿 수정시 템플릿 제목에 빈 값이 들어갈 경우 예외가 발생한다.")
    void updateWithEmptyTemplateTitle(String title) throws Exception {
        // given
        TemplateUpdateRequest request = new TemplateUpdateRequest(title, "description", List.of());

        // when, then
        assertBadRequestFromPut("/api/templates/" + 1L, request, "템플릿의 제목은 비어있을 수 없습니다.");
    }

    @ParameterizedTest
    @NullSource
    @DisplayName("템플릿 수정시 템플릿 설명에 null 값이 들어갈 경우 예외가 발생한다.")
    void updateWithEmptyTemplateDescription(String description) throws Exception {
        // given
        TemplateUpdateRequest request = new TemplateUpdateRequest("title", description, List.of());

        // when, then
        assertBadRequestFromPut("/api/templates/" + 1L, request, "템플릿의 설명 작성 중 오류가 발생했습니다.");
    }

    @ParameterizedTest
    @NullSource
    @DisplayName("템플릿 수정시 템플릿 질문 목록에 null 값이 들어갈 경우 예외가 발생한다.")
    void updateWithNullQuestionList(List<TemplateQuestionUpdateRequest> questions) throws Exception {
        // given
        TemplateUpdateRequest request = new TemplateUpdateRequest("title", "description", questions);

        // when, then
        assertBadRequestFromPut("/api/templates/" + 1L, request, "템플릿의 질문 목록 수정 중 오류가 발생했습니다.");
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
