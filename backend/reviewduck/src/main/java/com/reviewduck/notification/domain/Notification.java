package com.reviewduck.notification.domain;

import com.reviewduck.common.domain.BaseDate;
import com.reviewduck.member.domain.Member;
import com.reviewduck.notification.vo.NotificationType;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
public class Notification extends BaseDate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    private Member member;

    @Enumerated(EnumType.STRING)
    private NotificationType type;

    private String content;

    private boolean isRead;

    private boolean isSent;
}
