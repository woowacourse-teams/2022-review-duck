package com.reviewduck.admin.service;

import static org.assertj.core.api.Assertions.*;

import java.util.List;

import javax.transaction.Transactional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.jdbc.Sql;

import com.reviewduck.admin.dto.response.AdminMemberResponse;
import com.reviewduck.admin.dto.response.AdminMembersResponse;
import com.reviewduck.admin.repository.AdminMemberRepository;
import com.reviewduck.common.exception.NotFoundException;
import com.reviewduck.member.domain.Member;
import com.reviewduck.member.service.MemberService;

@SpringBootTest
@Sql("classpath:truncate.sql")
@Transactional
public class AdminMemberServiceTest {

    @Autowired
    private AdminMemberService adminMemberService;

    @Autowired
    private AdminMemberRepository adminMemberRepository;

    private Member savedMember;

    @BeforeEach
    void createAndSaveMember() {
        Member member = new Member("1", "panda", "제이슨", "testUrl");
        savedMember = adminMemberRepository.save(member);
    }

    @Test
    @DisplayName("멤버를 모두 조회한다.")
    void findAllMembers() {
        // given
        Member member2 = new Member("2", "ariari", "브리", "testUrl2");
        adminMemberRepository.save(member2);

        // when
        AdminMembersResponse membersResponse = adminMemberService.findAllMembers();
        List<AdminMemberResponse> members = membersResponse.getMembers();
        // then
        assertThat(members).hasSize(2);
        assertThat(members.get(0)).usingRecursiveComparison()
            .ignoringFields("createdAt", "updatedAt")
            .isEqualTo(savedMember);
    }

    @Test
    @DisplayName("멤버를 삭제한다.")
    void deleteMember() {
        // when
        adminMemberService.deleteMember(savedMember.getId());

        AdminMembersResponse membersResponse = adminMemberService.findAllMembers();
        List<AdminMemberResponse> members = membersResponse.getMembers();
        // then
        assertThat(members).hasSize(1);
        assertThat(members.get(0).getNickname()).isEqualTo("탈퇴한 회원입니다.");
    }

    @Test
    @DisplayName("존재하지 않는 멤버를 삭제할 수 없다.")
    void failToDeleteMember() {
        // when, then
        assertThatThrownBy(() -> adminMemberService.deleteMember(9999L))
            .isInstanceOf(NotFoundException.class)
            .hasMessageContaining("존재하지 않는 사용자입니다.");
    }
}
