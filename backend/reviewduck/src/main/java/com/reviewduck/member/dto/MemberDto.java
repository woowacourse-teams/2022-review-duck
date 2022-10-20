package com.reviewduck.member.dto;

import com.reviewduck.member.domain.Member;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class MemberDto {

    private static final MemberDto MEMBER_NOT_LOGIN = new MemberDto(-1, "not-login");

    private long id;
    private String socialId;

    public static MemberDto from(Member member) {
        return new MemberDto(
            member.getId(),
            member.getSocialId()
        );
    }

    public static MemberDto getMemberNotLogin() {
        return MEMBER_NOT_LOGIN;
    }
}
