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

    public Member(final Long id, final String socialId, final String socialNickname, final String nickname,
        final String profileUrl, final boolean isAdmin) {
        validate(nickname);
        this.id = id;
        this.socialId = socialId;
        this.socialNickname = socialNickname;
        this.nickname = nickname;
        this.profileUrl = profileUrl;
        this.isAdmin = isAdmin;
    }

    public Member(Long id, String socialId, String socialNickname, String nickname, String profileUrl) {
        this(id, socialId, socialNickname, nickname, profileUrl, false);
    }

    public Member(String socialId, String socialNickname, String nickname, String profileUrl) {
        this(null, socialId, socialNickname, nickname, profileUrl);
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

    public boolean isSameId(long memberId) {
        return memberId == id;
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
}
