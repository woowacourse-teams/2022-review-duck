package com.reviewduck.admin.service;

import java.util.List;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.reviewduck.admin.dto.response.AdminTemplateResponse;
import com.reviewduck.admin.dto.response.AdminTemplatesResponse;
import com.reviewduck.template.domain.Template;

import lombok.AllArgsConstructor;

@Component
@Transactional(readOnly = true)
@AllArgsConstructor
public class AdminTemplateAggregator {

    private final AdminTemplateService adminTemplateService;

    public AdminTemplatesResponse findAll() {
        List<Template> templates = adminTemplateService.findAllTemplates();
        return AdminTemplatesResponse.from(templates);
    }

    @CacheEvict(value = "templateCacheStore", key = "#templateId")
    public void deleteTemplateById(Long templateId) {
        adminTemplateService.deleteTemplateById(templateId);
    }

    public AdminTemplateResponse findById(Long templateId) {
        Template template = adminTemplateService.findById(templateId);
        return AdminTemplateResponse.from(template);
    }

    public AdminTemplatesResponse findTemplatesByMemberId(Long memberId) {
        List<Template> templates = adminTemplateService.findTemplatesByMemberId(memberId);
        return AdminTemplatesResponse.from(templates);
    }
}
