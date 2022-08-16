package com.reviewduck.member.repository;

import static org.assertj.core.api.Assertions.*;
import static org.junit.jupiter.api.Assertions.*;

import java.util.Optional;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.context.annotation.Import;

import com.reviewduck.config.JpaAuditingConfig;
import com.reviewduck.member.domain.Member;

@DataJpaTest
@Import(JpaAuditingConfig.class)
public class MemberRepositoryTest {

    @Autowired
    private MemberRepository memberRepository;

    @Test
    @DisplayName("멤버를 저장한다.")
    void saveMember() {
        // given
        Member member = new Member("1", "panda", "제이슨", "testUrl");

        // when
        Member savedMember = memberRepository.save(member);

        // then
        assertAll(
            () -> assertThat(savedMember.getSocialNickname()).isEqualTo("panda"),
            () -> assertThat(savedMember.getNickname()).isEqualTo("제이슨"),
            () -> assertThat(savedMember.getProfileUrl()).isEqualTo("testUrl")
        );
    }

    @Test
    @DisplayName("소셜 아이디로 존재 여부를 확인한다.")
    void existsMemberBySocialId() {
        // given
        Member member = new Member("1", "panda", "제이슨", "testUrl");
        memberRepository.save(member);

        // when
        Optional<Member> foundMember1 = memberRepository.findBySocialId("1");
        Optional<Member> foundMember2 = memberRepository.findBySocialId("2");

        // then
        assertAll(
            () -> assertThat(foundMember1.isPresent()).isTrue(),
            () -> assertThat(foundMember2.isPresent()).isFalse()
        );
    }

    @Test
    @DisplayName("소셜 아이디로 멤버를 조회한다.")
    void findMemberBySocialId() {
        // given
        Member member = new Member("1", "panda", "제이슨", "testUrl");
        memberRepository.save(member);

        // when
        Optional<Member> foundMember = memberRepository.findBySocialId(member.getSocialId());

        // then
        assertAll(
            () -> assertThat(foundMember.isPresent()).isTrue(),
            () -> assertThat(foundMember.get()).usingRecursiveComparison().isEqualTo(member)
        );
    }
}
