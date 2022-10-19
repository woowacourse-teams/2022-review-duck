package com.reviewduck.member.domain;

import static org.assertj.core.api.Assertions.*;
import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.junit.jupiter.params.provider.NullAndEmptySource;

import com.reviewduck.member.exception.MemberException;

public class MemberTest {

    @Test
    @DisplayName("제약조건에 걸리지 않으면 멤버가 생성된다.")
    void createMember() {
        // when, then
        assertDoesNotThrow(() ->
            new Member("1", "socialId", "nickname", "profileUrl"));
    }

    @ParameterizedTest
    @NullAndEmptySource
    @DisplayName("멤버 생성 시 닉네임이 비어있을 수 없다.")
    void notBlankNickname(String nickname) {
        //when, then
        assertThatThrownBy(() -> new Member("1", "socialId", nickname, "profileUrl"))
            .isInstanceOf(MemberException.class)
            .hasMessageContaining("닉네임이 비어있을 수 없습니다.");
    }

    @Test
    @DisplayName("멤버의 닉네임을 변경한다.")
    void updateNickname() {
        // given
        Member member = new Member("1", "socialId", "original nickname", "profileUrl");

        // when
        String expected = "updated nickname";
        member.updateNickname(expected);

        // then
        assertThat(member.getNickname()).isEqualTo(expected);
    }

    @ParameterizedTest
    @NullAndEmptySource
    @DisplayName("올바르지 않은 닉네임으로 변경할 수 없다.")
    void updateToEmptyNickname(String nicknameToUpdate) {
        // given
        Member member = new Member("1", "socialId", "original nickname", "profileUrl");

        // when, then
        assertThatThrownBy(() -> member.updateNickname(nicknameToUpdate))
            .isInstanceOf(MemberException.class)
            .hasMessageContaining("닉네임이 비어있을 수 없습니다.");
    }

    @Test
    @DisplayName("멤버의 프로필 url과 소셜 닉네임을 변경한다.")
    void updateSocialInfo() {
        // given
        Member member = new Member("1", "socialId", "original nickname", "profileUrl");

        // when
        String expectedProfileUrl = "updated profileUrl";
        String expectedSocialNickname = "update nickname";
        member.updateSocialInfo(expectedSocialNickname, expectedProfileUrl);

        // then
        assertAll(
            () -> assertThat(member.getSocialNickname()).isEqualTo(expectedSocialNickname),
            () -> assertThat(member.getProfileUrl()).isEqualTo(expectedProfileUrl)
        );
    }

    @ParameterizedTest
    @DisplayName("id가 같은지 검증한다.")
    @CsvSource(value = {"1:true", "2:false"}, delimiter = ':')
    void isSameId(long id, boolean expected) {
        // given
        Member member = new Member(1L,"1", "socialId", "original nickname", "profileUrl");

        // when, then
        assertThat(member.isSameId(id)).isEqualTo(expected);
    }
}
