package com.reviewduck.admin.controller;

import static com.reviewduck.common.util.Logging.*;

import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.reviewduck.admin.dto.AdminMemberDto;
import com.reviewduck.admin.dto.response.AdminTemplateResponse;
import com.reviewduck.admin.dto.response.AdminTemplatesResponse;
import com.reviewduck.admin.service.AdminTemplateAggregator;
import com.reviewduck.auth.exception.AuthorizationException;
import com.reviewduck.auth.support.AdminAuthenticationPrincipal;

import io.swagger.v3.oas.annotations.Operation;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/admin/templates")
@AllArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class AdminTemplateController {

    private final AdminTemplateAggregator adminTemplateAggregator;

    @Operation(summary = "생성된 템플릿을 모두 조회한다")
    @GetMapping()
    @ResponseStatus(HttpStatus.OK)
    public AdminTemplatesResponse findAllTemplates(@AdminAuthenticationPrincipal AdminMemberDto member) {

        info("api/admin/templates", "GET", "");

        validateAdmin(member);
        return adminTemplateAggregator.findAllTemplates();
    }

    @Operation(summary = "단일 템플릿을 조회한다")
    @GetMapping("/{templateId}")
    @ResponseStatus(HttpStatus.OK)
    public AdminTemplateResponse findTemplate(@AdminAuthenticationPrincipal AdminMemberDto member,
        @PathVariable long templateId) {

        info("api/admin/templates/" + templateId, "GET", "");

        validateAdmin(member);
        return adminTemplateAggregator.findTemplate(templateId);
    }

    @Operation(summary = "사용자가 생성한 템플릿을 모두 조회한다.")
    @GetMapping(params = "memberId")
    @ResponseStatus(HttpStatus.OK)
    public AdminTemplatesResponse findMemberTemplates(@AdminAuthenticationPrincipal AdminMemberDto member,
        @RequestParam(value = "memberId") long memberId) {

        info("/api/templates?memberId=" + memberId, "GET", "");

        validateAdmin(member);
        return adminTemplateAggregator.findMemberTemplates(memberId);
    }

    @Transactional
    @Operation(summary = "템플릿을 삭제한다")
    @DeleteMapping("/{templateId}")
    @ResponseStatus(HttpStatus.OK)
    public void deleteTemplate(@AdminAuthenticationPrincipal AdminMemberDto member, @PathVariable long templateId) {

        info("api/admin/templates/" + templateId, "DELETE", "");

        validateAdmin(member);
        adminTemplateAggregator.deleteTemplate(templateId);
    }

    private void validateAdmin(AdminMemberDto member) {
        if (!member.isAdmin()) {
            throw new AuthorizationException("어드민 권한이 없습니다.");
        }
    }
}
