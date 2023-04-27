package com.reviewduck.review.domain;

import com.reviewduck.common.domain.BaseDate;
import com.reviewduck.member.domain.Member;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;

import static lombok.AccessLevel.PROTECTED;

@Entity
@NoArgsConstructor(access = PROTECTED)
@Getter
@Table(name = "review_comment")
public class ReviewComment extends BaseDate {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long reviewId;

    @ManyToOne(fetch = FetchType.LAZY)
    private Member member;

    @Column(nullable = false)
    private String content;

    public ReviewComment(Long reviewId, Member member, String content) {
        this.reviewId = reviewId;
        this.member = member;
        this.content = content;
    }

    public void update(String content) {
        this.content = content;
    }

    public boolean isCommenter(long memberId) {
        return this.member.isSameId(memberId);
    }
}
