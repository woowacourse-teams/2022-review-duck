package com.reviewduck.admin.service;

import java.util.List;

import org.springframework.cache.annotation.CacheEvict;

import com.reviewduck.admin.dto.response.AdminTemplateResponse;
import com.reviewduck.admin.dto.response.AdminTemplatesResponse;
import com.reviewduck.common.annotation.Aggregator;
import com.reviewduck.template.domain.Template;

import lombok.AllArgsConstructor;

@Aggregator
@AllArgsConstructor
public class AdminTemplateAggregator {

    private final AdminTemplateService adminTemplateService;

    public AdminTemplatesResponse findAllTemplates() {
        List<Template> templates = adminTemplateService.findAllTemplates();
        return AdminTemplatesResponse.from(templates);
    }

    public AdminTemplateResponse findTemplate(long templateId) {
        Template template = adminTemplateService.findById(templateId);
        return AdminTemplateResponse.from(template);
    }

    public AdminTemplatesResponse findMemberTemplates(long memberId) {
        List<Template> templates = adminTemplateService.findTemplatesByMemberId(memberId);
        return AdminTemplatesResponse.from(templates);
    }

    @CacheEvict(value = "templateCacheStore", key = "#templateId")
    public void deleteTemplate(long templateId) {
        adminTemplateService.deleteTemplateById(templateId);
    }
}
