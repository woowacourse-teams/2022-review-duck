package com.reviewduck.template.controller;

import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
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
import com.reviewduck.review.service.ReviewFormService;
import com.reviewduck.template.dto.controller.request.TemplateCreateRequest;
import com.reviewduck.template.dto.controller.request.TemplateQuestionCreateRequest;
import com.reviewduck.template.dto.controller.request.TemplateQuestionUpdateRequest;
import com.reviewduck.template.dto.controller.request.TemplateUpdateRequest;
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
    private JwtTokenProvider jwtTokenProvider;

    @MockBean
    private MemberService memberService;

    @BeforeEach
    void createMemberAndGetAccessToken() {
        Member member = new Member("1", "panda", "제이슨", "profileUrl");
        given(jwtTokenProvider.getAccessTokenPayload(any())).willReturn("1");
        given(memberService.findById(any())).willReturn(member);
    }

    @Nested
    @DisplayName("템플릿 생성")
    class createTemplate {

        @ParameterizedTest
        @NullAndEmptySource
        @DisplayName("템플릿 제목에 빈 값이 들어갈 경우 예외가 발생한다.")
        void emptyTemplateTitle(String title) throws Exception {
            // given
            TemplateCreateRequest request = new TemplateCreateRequest(title, "description", List.of());

            // when, then
            assertBadRequestFromPost("/api/templates", request, "템플릿의 제목은 비어있을 수 없습니다.");
        }

        @ParameterizedTest
        @NullSource
        @DisplayName("템플릿 설명에 null 값이 들어갈 경우 예외가 발생한다.")
        void nullDescription(String description) throws Exception {
            // given
            TemplateCreateRequest request = new TemplateCreateRequest("title", description, List.of());

            // when, then
            assertBadRequestFromPost("/api/templates", request, "템플릿의 설명 작성 중 오류가 발생했습니다.");

        }

        @ParameterizedTest
        @NullSource
        @DisplayName("질문 목록에 null 값이 들어갈 경우 예외가 발생한다.")
        void nullQuestionList(List<TemplateQuestionCreateRequest> questions) throws Exception {
            // given
            TemplateCreateRequest request = new TemplateCreateRequest("title", "description", questions);

            // when, then
            assertBadRequestFromPost("/api/templates", request, "템플릿의 질문 목록 생성 중 오류가 발생했습니다.");
        }

        @ParameterizedTest
        @NullSource
        @DisplayName("질문에 null 값이 들어갈 경우 예외가 발생한다.")
        void nullQuestionValue(String value) throws Exception {
            // given
            TemplateCreateRequest request = new TemplateCreateRequest("title", "description",
                List.of(new TemplateQuestionCreateRequest(value, "")));

            // when, then
            assertBadRequestFromPost("/api/templates", request, "템플릿의 질문 목록 생성 중 오류가 발생했습니다.");
        }

        @ParameterizedTest
        @NullSource
        @DisplayName("질문 설명에 null 값이 들어갈 경우 예외가 발생한다.")
        void nullQuestionDescription(String description) throws Exception {
            // given
            TemplateCreateRequest request = new TemplateCreateRequest("title", "description",
                List.of(new TemplateQuestionCreateRequest("value", description)));

            // when, then
            assertBadRequestFromPost("/api/templates", request, "템플릿의 질문 설명 생성 중 오류가 발생했습니다.");
        }

    }

    @Nested
    @DisplayName("사용자별 템플릿 전체 조회")
    class findByMemberSocialId {

        @Test
        @DisplayName("member 파라미터에 값이 없을 경우 예외가 발생한다.")
        void emptyMember() throws Exception {
            assertBadRequestFromGet("/api/templates?member=", "파라미터 정보가 올바르지 않습니다.");
        }

    }

    @Nested
    @DisplayName("템플릿 수정")
    class updateTemplate {

        @ParameterizedTest
        @NullAndEmptySource
        @DisplayName("템플릿 제목에 빈 값이 들어갈 경우 예외가 발생한다.")
        void emptyTemplateTitle(String title) throws Exception {
            // given
            TemplateUpdateRequest request = new TemplateUpdateRequest(title, "description", List.of());

            // when, then
            assertBadRequestFromPut("/api/templates/" + 1L, request, "템플릿의 제목은 비어있을 수 없습니다.");
        }

        @ParameterizedTest
        @NullSource
        @DisplayName("템플릿 설명에 null 값이 들어갈 경우 예외가 발생한다.")
        void emptyTemplateDescription(String description) throws Exception {
            // given
            TemplateUpdateRequest request = new TemplateUpdateRequest("title", description, List.of());

            // when, then
            assertBadRequestFromPut("/api/templates/" + 1L, request, "템플릿의 설명 작성 중 오류가 발생했습니다.");
        }

        @ParameterizedTest
        @NullSource
        @DisplayName("질문 목록에 null 값이 들어갈 경우 예외가 발생한다.")
        void updateWithNullQuestionList(List<TemplateQuestionUpdateRequest> questions) throws Exception {
            // given
            TemplateUpdateRequest request = new TemplateUpdateRequest("title", "description", questions);

            // when, then
            assertBadRequestFromPut("/api/templates/" + 1L, request, "템플릿의 질문 목록 수정 중 오류가 발생했습니다.");
        }

        @ParameterizedTest
        @NullSource
        @DisplayName("질문에 null 값이 들어갈 경우 예외가 발생한다.")
        void nullQuestionValue(String value) throws Exception {
            // given
            TemplateCreateRequest request = new TemplateCreateRequest("title", "description",
                List.of(new TemplateQuestionCreateRequest(value, "")));

            // when, then
            assertBadRequestFromPut("/api/templates/" + 1L, request, "템플릿의 질문 수정 중 오류가 발생했습니다.");
        }

        @ParameterizedTest
        @NullSource
        @DisplayName("질문 설명에 null 값이 들어갈 경우 예외가 발생한다.")
        void nullQuestionDescription(String description) throws Exception {
            // given
            TemplateCreateRequest request = new TemplateCreateRequest("title", "description",
                List.of(new TemplateQuestionCreateRequest("value", description)));

            // when, then
            assertBadRequestFromPut("/api/templates/" + 1L, request, "템플릿의 질문 설명 수정 중 오류가 발생했습니다.");
        }

    }

    private void assertBadRequestFromGet(String uri, String errorMessage) throws Exception {
        mockMvc.perform(post(uri)
                .header("Authorization", "Bearer " + accessToken)
                .contentType(MediaType.APPLICATION_JSON)
            ).andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.message", containsString(errorMessage)));
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
