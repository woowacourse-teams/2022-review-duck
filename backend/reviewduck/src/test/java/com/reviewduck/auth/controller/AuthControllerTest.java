package com.reviewduck.auth.controller;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.NullAndEmptySource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.reviewduck.auth.dto.request.LoginRequest;
import com.reviewduck.auth.service.AuthService;
import com.reviewduck.member.service.MemberService;

@WebMvcTest(AuthController.class)
public class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private ObjectMapper objectMapper;
    @MockBean
    private AuthService authService;
    @MockBean
    private MemberService memberService;

    @ParameterizedTest
    @NullAndEmptySource
    @DisplayName("로그인 시 인증 코드에 빈 값이 들어갈 경우 예외가 발생한다.")
    void emptyNickNameInEditing(String code) throws Exception {
        // given
        LoginRequest request = new LoginRequest(code);

        // when, then
        assertBadRequestFromPost("/api/login", request, "인증 코드는 비어있을 수 없습니다.");
    }

    private void assertBadRequestFromPost(String uri, Object request, String errorMessage) throws Exception {
        mockMvc.perform(post(uri)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request))
            ).andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.message", containsString(errorMessage)));
    }
}
