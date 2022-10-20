package com.reviewduck.admin.dto;

import com.reviewduck.member.domain.Member;
import com.reviewduck.member.dto.MemberDto;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class AdminMemberDto {

    private static final AdminMemberDto MEMBER_NOT_LOGIN = new AdminMemberDto(false, -1, "not-login");

    private boolean isAdmin;
    private long id;
    private String socialId;

    public static AdminMemberDto from(Member member) {
        return new AdminMemberDto(
            member.isAdmin(),
            member.getId(),
            member.getSocialId()
        );
    }

    public static AdminMemberDto getMemberNotLogin() {
        return MEMBER_NOT_LOGIN;
    }
}
