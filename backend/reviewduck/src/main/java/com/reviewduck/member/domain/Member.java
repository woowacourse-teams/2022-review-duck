package com.reviewduck.member.domain;

import static lombok.AccessLevel.*;

import java.util.Objects;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Transient;

import org.hibernate.Hibernate;

import com.reviewduck.common.domain.BaseDate;
import com.reviewduck.member.exception.MemberException;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = PROTECTED)
@AllArgsConstructor
public class Member extends BaseDate {

    @Transient
    private static final Member MEMBER_NOT_LOGIN = new Member(-1L, "-1", "socialNickname", "nickname", "url");
    private static final String deletedInfo = "-";
    private static final String deletedNickname = "탈퇴한 회원입니다.";

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String socialId;

    private String socialNickname;

    private String nickname;

    private String profileUrl;

    private boolean isAdmin;

    public Member(Long id, String socialId, String socialNickname, String nickname, String profileUrl) {
        this(id, socialId, socialNickname, nickname, profileUrl, false);
        validate(nickname);
    }

    public Member(String socialId, String socialNickname, String nickname, String profileUrl) {
        this(null, socialId, socialNickname, nickname, profileUrl);
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
        this.socialId = deletedInfo;
        this.socialNickname = deletedInfo;
        this.nickname = deletedNickname;
        this.profileUrl = deletedInfo;
    }

    public boolean isAdmin() {
        return this.isAdmin;
    }

    private void validate(String nickname) {
        if (nickname == null || nickname.isBlank()) {
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
        return id != null && Objects.equals(id, member.getId());
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }

    public boolean isSameId(long memberId) {
        return memberId == id;
    }
}
