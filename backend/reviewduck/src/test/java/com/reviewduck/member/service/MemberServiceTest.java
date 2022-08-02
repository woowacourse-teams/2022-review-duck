package com.reviewduck.member.service;

import static org.assertj.core.api.Assertions.*;
import static org.junit.jupiter.api.Assertions.*;

import javax.transaction.Transactional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.jdbc.Sql;

import com.reviewduck.member.domain.Member;

@SpringBootTest
@Sql("classpath:truncate.sql")
@Transactional
public class MemberServiceTest {

    private Member savedMember;
    @Autowired
    private MemberService memberService;

    @BeforeEach
    void createAndSaveMember() {
        Member member = new Member("1","panda", "제이슨", "testUrl");
        savedMember = memberService.save(member);
    }

    @Test
    @DisplayName("멤버를 저장한다.")
    void saveMember() {
        // given
        Member member = new Member("2","panda", "제이슨", "testUrl");

        // when
        Member savedMember = memberService.save(member);

        // then
        assertEqualMemberInfo(savedMember, member);
    }

    @Test
    @DisplayName("아이디로 멤버를 조회한다.")
    void findMemberById() {
        // when
        Member foundMember = memberService.findById(savedMember.getId());

        // then
        assertEqualMemberInfo(foundMember, savedMember);
    }

    @Test
    @DisplayName("소셜 아이디로 존재 여부를 확인한다.")
    void existsMemberBySocialId() {
        // when
        boolean isExistMember1 = memberService.existsMember("1");
        boolean isExistMember2 = memberService.existsMember("2");

        // then
        assertAll(
            () -> assertThat(isExistMember1).isTrue(),
            () -> assertThat(isExistMember2).isFalse()
        );
    }

    @Test
    @DisplayName("소셜 아이디로 멤버를 조회한다.")
    void findMemberBySocialId() {
        // when
        Member foundMember = memberService.findBySocialId(savedMember.getSocialId());

        // then
        assertEqualMemberInfo(foundMember, savedMember);
    }

    void assertEqualMemberInfo(Member actual, Member expected) {
        assertAll(
            () -> assertThat(actual.getSocialNickName()).isEqualTo(expected.getSocialNickName()),
            () -> assertThat(actual.getNickname()).isEqualTo(expected.getNickname()),
            () -> assertThat(actual.getProfileUrl()).isEqualTo(expected.getProfileUrl())
        );
    }
}
