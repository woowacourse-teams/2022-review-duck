package com.reviewduck.review.domain;

import com.reviewduck.common.domain.BaseDate;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;

import static lombok.AccessLevel.PROTECTED;

@Entity
@NoArgsConstructor(access = PROTECTED)
@Getter
public class ReviewComment extends BaseDate {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long reviewId;

    @Column(nullable = false)
    private Long memberId;

    @Column(nullable = false)
    private String content;

    public ReviewComment(Long reviewId, Long memberId, String content) {
        this.reviewId = reviewId;
        this.memberId = memberId;
        this.content = content;
    }

    public void update(String content) {
        this.content = content;
    }

    public boolean isCommenter(long memberId) {
        return this.memberId == memberId;
    }
}
