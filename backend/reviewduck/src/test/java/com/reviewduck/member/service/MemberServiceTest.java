package com.reviewduck.member.service;

import static org.assertj.core.api.Assertions.*;
import static org.junit.jupiter.api.Assertions.*;

import java.util.Optional;

import javax.transaction.Transactional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.NullAndEmptySource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.jdbc.Sql;

import com.reviewduck.member.domain.Member;
import com.reviewduck.member.exception.MemberException;

@SpringBootTest
@Sql("classpath:truncate.sql")
@Transactional
public class MemberServiceTest {

    @Autowired
    private MemberService memberService;

    private Member savedMember;

    @BeforeEach
    void createAndSaveMember() {
        Member member = new Member("1", "panda", "제이슨", "testUrl");
        savedMember = memberService.save(member);
    }

    @Test
    @DisplayName("멤버를 저장한다.")
    void saveMember() {
        // given
        Member member = new Member("2", "panda", "제이슨", "testUrl");

        // when
        Member savedMember = memberService.save(member);

        // then
        assertThat(savedMember).usingRecursiveComparison().isEqualTo(savedMember);
    }

    @Test
    @DisplayName("아이디로 멤버를 조회한다.")
    void findMemberById() {
        // when
        Member foundMember = memberService.findById(savedMember.getId());

        // then
        assertThat(foundMember).usingRecursiveComparison().isEqualTo(savedMember);
    }

    @Test
    @DisplayName("소셜 아이디가 존재하지 않으면 비어있는 Optional 값을 전달한다.")
    void existsMemberBySocialId() {
        // when
        Optional<Member> foundMember1 = memberService.findBySocialId("1");
        Optional<Member> foundMember2 = memberService.findBySocialId("2");

        // then
        assertAll(
            () -> assertThat(foundMember1.isPresent()).isTrue(),
            () -> assertThat(foundMember2.isPresent()).isFalse()
        );
    }

    @Test
    @DisplayName("소셜 아이디로 멤버를 조회한다.")
    void findMemberBySocialId() {
        // when
        Member foundMember = memberService.findBySocialId(savedMember.getSocialId()).get();

        // then
        assertThat(foundMember).usingRecursiveComparison().isEqualTo(savedMember);
    }

    @ParameterizedTest
    @NullAndEmptySource
    @DisplayName("올바르지 않은 닉네임으로 변경할 수 없다.")
    void updateToInvalidNickname(String nicknameToUpdate) {
        // when, then
        assertThatThrownBy(() -> memberService.updateNickname(savedMember, nicknameToUpdate))
            .isInstanceOf(MemberException.class)
            .hasMessageContaining("닉네임이 비어있을 수 없습니다.");
    }
}
