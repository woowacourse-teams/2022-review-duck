package com.reviewduck.notification.dto.response;

import com.reviewduck.notification.domain.Notification;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class NotificationResponse {

    private Long id;

    private String type;
    private String content;

    public static NotificationResponse from(Notification notification) {
        return new NotificationResponse(
                notification.getId(),
                notification.getType().name(),
                notification.getContent()
        );
    }
}
