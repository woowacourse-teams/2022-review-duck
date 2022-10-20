package com.reviewduck.member.dto.response;

import com.reviewduck.member.domain.Member;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class MemberDto {

    private long id;
    private String socialId;

    public static MemberDto from(Member member) {
        return new MemberDto(
            member.getId(),
            member.getSocialId()
        );
    }
}
