package com.reviewduck.notification.controller;

import com.reviewduck.auth.support.AuthenticationPrincipal;
import com.reviewduck.notification.dto.response.NotificationsResponse;
import com.reviewduck.notification.service.NotificationService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import com.reviewduck.member.dto.MemberDto;

import static com.reviewduck.common.util.Logging.info;
import static com.reviewduck.common.vo.PageConstant.DEFAULT_PAGE;
import static com.reviewduck.common.vo.PageConstant.DEFAULT_SIZE;

@RestController
@RequestMapping("/api/notification")
@AllArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @Operation(summary = "사용자에 대한 알림을 모두 조회한다.")
    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public NotificationsResponse findByMember(@AuthenticationPrincipal MemberDto member,
                                              @RequestParam(required = false, defaultValue = DEFAULT_PAGE) int page,
                                              @RequestParam(required = false, defaultValue = DEFAULT_SIZE) int size) {


        info("/api/notification", "GET", "");

        return notificationService.findAllByMember(member.getId(), page, size);
    }
}
