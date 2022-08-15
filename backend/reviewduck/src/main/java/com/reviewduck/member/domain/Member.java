package com.reviewduck.member.domain;

import static lombok.AccessLevel.*;

import java.util.Objects;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

import org.hibernate.Hibernate;

import com.reviewduck.common.domain.BaseDate;
import com.reviewduck.member.exception.MemberException;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = PROTECTED)
public class Member extends BaseDate {

    private static final Member MEMBER_NOT_LOGIN = new Member("-1", "socialNickname", "nickname", "url");

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String socialId;

    private String socialNickname;

    private String nickname;

    private String profileUrl;

    private boolean isAdmin;

    public Member(String socialId, String socialNickname, String nickname, String profileUrl) {
        validate(nickname);
        this.socialId = socialId;
        this.socialNickname = socialNickname;
        this.nickname = nickname;
        this.profileUrl = profileUrl;
        this.isAdmin = false;
    }

    public static Member getMemberNotLogin() {
        return MEMBER_NOT_LOGIN;
    }

    public void updateNickname(String nickname) {
        validate(nickname);
        this.nickname = nickname;
    }

    public void updateSocialInfo(String socialNickname, String profileUrl) {
        this.socialNickname = socialNickname;
        this.profileUrl = profileUrl;
    }

    public void deleteAllInfo() {
        this.socialId = "-";
        this.socialNickname = "-";
        this.nickname = "탈퇴한 회원입니다";
        this.profileUrl = "-";
    }

    public boolean isAdmin() {
        return this.isAdmin;
    }

    private void validate(String nickname) {
        if (Objects.isNull(nickname) || nickname.isBlank()) {
            throw new MemberException("닉네임이 비어있을 수 없습니다.");
        }
    }

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o))
            return false;
        Member member = (Member)o;
        return Objects.equals(id, member.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
