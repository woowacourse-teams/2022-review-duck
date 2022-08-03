package com.reviewduck.member.acceptance;

import static org.assertj.core.api.Assertions.*;
import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;

import com.reviewduck.acceptance.AcceptanceTest;
import com.reviewduck.auth.support.JwtTokenProvider;
import com.reviewduck.member.domain.Member;
import com.reviewduck.member.dto.response.MemberResponse;
import com.reviewduck.member.service.MemberService;

public class MemberAcceptanceTest extends AcceptanceTest {
    @Autowired
    private JwtTokenProvider jwtTokenProvider;
    @Autowired
    private MemberService memberService;

    @Test
    @DisplayName("본인의 사용자 정보를 조회한다.")
    void findMyMemberInfo() {
        // given
        Member member = new Member("1", "jason", "제이슨", "profileUrl");
        Member savedMember = memberService.save(member);

        String accessToken = jwtTokenProvider.createAccessToken(String.valueOf(savedMember.getId()));

        // when
        MemberResponse memberResponse = get("/api/members/me", accessToken)
            .statusCode(HttpStatus.OK.value())
            .extract()
            .as(MemberResponse.class);

        // then
        assertAll(
            () -> assertThat(memberResponse.getSocialNickname()).isEqualTo("jason"),
            () -> assertThat(memberResponse.getNickname()).isEqualTo("제이슨"),
            () -> assertThat(memberResponse.getProfileUrl()).isEqualTo("profileUrl")
        );
    }

    @Test
    @DisplayName("로그인하지 않고 사용자 정보를 조회할 수 없다.")
    void failToFindMyMemberInfo() {
        // when, then
        get("/api/members/me")
            .statusCode(HttpStatus.UNAUTHORIZED.value());
    }
}
