package com.reviewduck.member.acceptance;

import static org.assertj.core.api.Assertions.*;
import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;

import com.reviewduck.common.acceptance.AcceptanceTest;
import com.reviewduck.member.dto.request.MemberUpdateNicknameRequest;
import com.reviewduck.member.dto.response.MemberResponse;

public class MemberAcceptanceTest extends AcceptanceTest {

    @Nested
    @DisplayName("자신의 정보 조회")
    class findMyInfo {

        @Test
        @DisplayName("본인의 사용자 정보를 조회한다.")
        void findMyMemberInfo() {
            // when
            MemberResponse memberResponse = get("/api/members/me", accessToken1)
                .statusCode(HttpStatus.OK.value())
                .extract()
                .as(MemberResponse.class);

            // then
            assertAll(
                () -> assertThat(memberResponse.getSocialNickname()).isEqualTo("panda"),
                () -> assertThat(memberResponse.getNickname()).isEqualTo("제이슨"),
                () -> assertThat(memberResponse.getProfileUrl()).isEqualTo("profileUrl1")
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

    @Nested
    @DisplayName("사용자 정보 조회")
    class findMemberInfo {

        @Test
        @DisplayName("본인의 사용자 정보를 조회한다.")
        void findMyMemberInfo() {
            // when
            MemberResponse memberResponse = get("/api/members/" + savedMember.getSocialId(), accessToken1)
                .statusCode(HttpStatus.OK.value())
                .extract()
                .as(MemberResponse.class);

            // then
            assertAll(
                () -> assertThat(memberResponse.getIsMine()).isTrue(),
                () -> assertThat(memberResponse.getSocialNickname()).isEqualTo("panda"),
                () -> assertThat(memberResponse.getNickname()).isEqualTo("제이슨"),
                () -> assertThat(memberResponse.getProfileUrl()).isEqualTo("profileUrl1")
            );
        }

        @Test
        @DisplayName("타인의 사용자 정보를 조회한다.")
        void findOtherMemberInfo() {
            // when
            MemberResponse memberResponse = get("/api/members/" + savedMember2.getSocialId(), accessToken1)
                .statusCode(HttpStatus.OK.value())
                .extract()
                .as(MemberResponse.class);

            // then
            assertAll(
                () -> assertThat(memberResponse.getIsMine()).isFalse(),
                () -> assertThat(memberResponse.getSocialNickname()).isEqualTo("ariari"),
                () -> assertThat(memberResponse.getNickname()).isEqualTo("브리"),
                () -> assertThat(memberResponse.getProfileUrl()).isEqualTo("profileUrl2")
            );
        }

        @Test
        @DisplayName("로그인하지 않고 사용자 정보를 조회할 수 있다.")
        void findMemberInfoWithoutLogin() {
            // when, then
            get("/api/members/1")
                .statusCode(HttpStatus.OK.value());
        }

        @Test
        @DisplayName("존재하지 않는 사용자를 조회할 수 없다.")
        void failToFindInvalidSocialId() {
            // when, then
            get("/api/members/123", accessToken1)
                .statusCode(HttpStatus.NOT_FOUND.value());
        }
    }

    @Nested
    @DisplayName("닉네임 수정")
    class updateNickname {

        @Test
        @DisplayName("본인의 닉네임을 수정한다.")
        void updateMyNickname() {
            // when
            String nicknameToUpdate = "nickname to update";
            MemberUpdateNicknameRequest updateRequest = new MemberUpdateNicknameRequest(nicknameToUpdate);
            put("/api/members/me", updateRequest, accessToken1)
                .statusCode(HttpStatus.NO_CONTENT.value());

            MemberResponse memberResponse = get("/api/members/" + savedMember.getSocialId(), accessToken1)
                .statusCode(HttpStatus.OK.value())
                .extract()
                .as(MemberResponse.class);

            // then
            assertAll(
                () -> assertThat(memberResponse.getNickname()).isEqualTo(nicknameToUpdate)
            );
        }

        @Test
        @DisplayName("로그인하지 않고 사용자 닉네임을 수정할 수 없다.")
        void failToUpdateMyNickname() {
            // when, then
            MemberUpdateNicknameRequest updateRequest = new MemberUpdateNicknameRequest("nicknameToUpdate");
            put("/api/members/me", updateRequest)
                .statusCode(HttpStatus.UNAUTHORIZED.value());
        }
    }
}
