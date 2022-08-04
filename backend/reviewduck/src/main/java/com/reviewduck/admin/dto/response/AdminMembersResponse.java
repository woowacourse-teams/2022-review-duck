package com.reviewduck.admin.dto.response;

import java.util.List;
import java.util.stream.Collectors;

import com.reviewduck.member.domain.Member;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class AdminMembersResponse {
    private List<AdminMemberResponse> members;

    public static AdminMembersResponse from(List<Member> members) {
        List<AdminMemberResponse> memberResponses = members.stream()
            .map(AdminMemberResponse::from)
            .collect(Collectors.toList());

        return new AdminMembersResponse(memberResponses);
    }
}
