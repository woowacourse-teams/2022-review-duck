package com.reviewduck.member.controller;

import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.NullAndEmptySource;
import org.springframework.http.MediaType;

import com.reviewduck.controller.ControllerTest;
import com.reviewduck.member.domain.Member;
import com.reviewduck.member.dto.request.MemberUpdateNicknameRequest;

public class MemberControllerTest extends ControllerTest {

    @BeforeEach
    void createMemberAndGetAccessToken() {
        Member member = new Member("1", "jason", "제이슨", "profileUrl");
        given(jwtTokenProvider.getAccessTokenPayload(any())).willReturn("1");
        given(memberService.findById(any())).willReturn(member);
    }

    @ParameterizedTest
    @NullAndEmptySource
    @DisplayName("멤버 닉네임 변경시 빈 값이 들어갈 경우 예외가 발생한다.")
    void emptyNickNameInEditing(String nicknameToUpdate) throws Exception {
        // given
        MemberUpdateNicknameRequest request = new MemberUpdateNicknameRequest(nicknameToUpdate);

        // when, then
        assertBadRequestFromPut("/api/members/me", request, "닉네임이 비어있을 수 없습니다.");
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
