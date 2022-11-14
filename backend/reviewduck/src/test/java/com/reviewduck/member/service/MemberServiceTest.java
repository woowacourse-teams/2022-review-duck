package com.reviewduck.member.service;

import static org.assertj.core.api.Assertions.*;

import java.time.format.DateTimeFormatter;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.NullAndEmptySource;

import com.reviewduck.common.service.ServiceTest;
import com.reviewduck.member.domain.Member;
import com.reviewduck.member.exception.MemberException;

public class MemberServiceTest extends ServiceTest {

    @Test
    @DisplayName("멤버를 저장한다.")
    void saveMember() {
        // given
        Member member = new Member("9999", "panda", "제이슨", "testUrl");

        // when
        Member savedMember = memberService.save(member);

        // then
        assertMember(savedMember, member1);
    }

    @Test
    @DisplayName("아이디로 멤버를 조회한다.")
    void findMemberById() {
        // when
        Member foundMember = memberService.findById(member1.getId());

        // then
        assertMember(foundMember, member1);
    }

    @ParameterizedTest
    @NullAndEmptySource
    @DisplayName("올바르지 않은 닉네임으로 변경할 수 없다.")
    void updateToInvalidNickname(String nicknameToUpdate) {
        // when, then
        assertThatThrownBy(() -> memberService.updateNickname(member1.getId(), nicknameToUpdate))
            .isInstanceOf(MemberException.class)
            .hasMessageContaining("닉네임이 비어있을 수 없습니다.");
    }

    private void assertMember(Member actual, Member expected) {
        Assertions.assertAll(
            () -> assertThat(actual).usingRecursiveComparison()
                .ignoringFields("createdAt", "updatedAt").isEqualTo(expected),
            () -> assertThat(actual.getCreatedAt().format(DateTimeFormatter.ofPattern("uuuu-MM-dd HH:mm:ss")))
                .isEqualTo(expected.getCreatedAt().format(DateTimeFormatter.ofPattern("uuuu-MM-dd HH:mm:ss"))),
            () -> assertThat(actual.getUpdatedAt().format(DateTimeFormatter.ofPattern("uuuu-MM-dd HH:mm:ss")))
                .isEqualTo(expected.getUpdatedAt().format(DateTimeFormatter.ofPattern("uuuu-MM-dd HH:mm:ss")))
        );
    }
}
