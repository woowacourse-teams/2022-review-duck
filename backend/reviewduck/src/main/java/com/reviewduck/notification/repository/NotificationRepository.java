package com.reviewduck.notification.repository;

import com.reviewduck.member.domain.Member;
import com.reviewduck.notification.domain.Notification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.Repository;

public interface NotificationRepository extends Repository<Notification, Long> {

    Notification save(Notification notification);

    Page<Notification> findByMember(Member member, Pageable pageable);
}
