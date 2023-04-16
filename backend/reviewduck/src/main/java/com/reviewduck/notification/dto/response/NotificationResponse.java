package com.reviewduck.notification.dto.response;

import com.reviewduck.notification.domain.Notification;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.sql.Timestamp;

@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class NotificationResponse {

    private Long id;

    private String type;
    private String content;
    private long createdAt;

    public static NotificationResponse from(Notification notification) {
        long createdAt = Timestamp.valueOf(notification.getCreatedAt()).getTime();

        return new NotificationResponse(
                notification.getId(),
                notification.getType().name(),
                notification.getContent(),
                createdAt
        );
    }
}
