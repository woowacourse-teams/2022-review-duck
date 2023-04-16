package com.reviewduck.notification.service;

import com.reviewduck.common.exception.NotFoundException;
import com.reviewduck.member.domain.Member;
import com.reviewduck.notification.domain.Notification;
import com.reviewduck.notification.dto.response.NotificationsResponse;
import com.reviewduck.notification.repository.NotificationRepository;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.reviewduck.member.repository.MemberRepository;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
@AllArgsConstructor
public class NotificationService {

    private MemberRepository memberRepository;

    private NotificationRepository notificationRepository;

    public NotificationsResponse findAllByMember(long memberId, int page, int size) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new NotFoundException("존재하지 않는 사용자입니다."));

        Sort sort = Sort.by(Sort.Direction.DESC, "createdAt");
        PageRequest pageRequest = PageRequest.of(page, size, sort);
        Page<Notification> notifications = notificationRepository.findByMember(member, pageRequest);

        return NotificationsResponse.of(notifications);
    }
}
