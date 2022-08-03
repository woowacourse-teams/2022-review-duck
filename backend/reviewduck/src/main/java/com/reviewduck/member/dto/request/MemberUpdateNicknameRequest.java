package com.reviewduck.member.dto.request;

import javax.validation.constraints.NotBlank;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
@AllArgsConstructor
@Getter
@ToString
public class MemberUpdateNicknameRequest {

    @NotBlank(message = "닉네임이 비어있을 수 없습니다.")
    private String nickname;
}