package com.reviewduck.member.service;

import static org.assertj.core.api.Assertions.*;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.NullAndEmptySource;

import com.reviewduck.common.service.ServiceTest;
import com.reviewduck.member.domain.Member;
import com.reviewduck.member.exception.MemberException;

public class MemberServiceTest extends ServiceTest {

    @Test
    @DisplayName("아이디로 멤버를 조회한다.")
    void findMemberById() {
        // when
        Member foundMember = memberService.findById(member1.getId());

        // then
        assertThat(foundMember).usingRecursiveComparison().isEqualTo(member1);
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
}
