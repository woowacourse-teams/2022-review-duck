package com.reviewduck.admin.dto;

import com.reviewduck.member.domain.Member;
import com.reviewduck.member.dto.response.MemberDto;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class AdminMemberDto {

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

    public boolean getIsAdmin() {
        return isAdmin;
    }

    public static AdminMemberDto getMemberNotLogin() {
        return new AdminMemberDto(
            false,
            -1,
            "not-login"
        );
    }
}
