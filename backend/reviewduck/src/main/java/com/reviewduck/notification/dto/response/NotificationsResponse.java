package com.reviewduck.notification.dto.response;

import com.reviewduck.notification.domain.Notification;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.stream.Collectors;

@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class NotificationsResponse {

    private long numberOfNotifications;
    private boolean isLastPage;

    private List<NotificationResponse> notifications;

    public static NotificationsResponse of(Page<Notification> notifications) {
        List<NotificationResponse> notificationResponses = notifications.getContent().stream()
                .map(NotificationResponse::from)
                .collect(Collectors.toUnmodifiableList());

        return new NotificationsResponse(
                notifications.getTotalElements(),
                notifications.isLast(),
                notificationResponses
        );
    }

    public boolean getIsLastPage() {
        return isLastPage;
    }
}
