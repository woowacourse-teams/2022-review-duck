package com.reviewduck.admin.service;

import java.util.List;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.reviewduck.admin.dto.response.AdminTemplateResponse;
import com.reviewduck.admin.dto.response.AdminTemplatesResponse;
import com.reviewduck.admin.repository.AdminTemplateRepository;
import com.reviewduck.common.exception.NotFoundException;
import com.reviewduck.member.domain.Member;
import com.reviewduck.template.domain.Template;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
@Transactional(readOnly = true)
public class AdminTemplateService {

    private final AdminMemberService adminMemberService;
    private final AdminTemplateRepository adminTemplateRepository;

    public AdminTemplatesResponse findAllTemplates() {
        List<Template> templates = adminTemplateRepository.findAll();;
        return AdminTemplatesResponse.from(templates);
    }

    public AdminTemplateResponse findTemplate(long templateId) {
        Template template = findById(templateId);
        return AdminTemplateResponse.from(template);
    }

    public AdminTemplatesResponse findMemberTemplates(long memberId) {
        Member member = adminMemberService.findMemberById(memberId);

        List<Template> templates = adminTemplateRepository.findAllByMember(member);
        return AdminTemplatesResponse.from(templates);
    }

    @CacheEvict(value = "templateCacheStore", key = "#templateId")
    @Transactional
    public void deleteTemplate(long templateId) {
        Template template = findById(templateId);
        adminTemplateRepository.deleteById(template.getId());
    }

    private Template findById(long templateId) {
        return adminTemplateRepository.findById(templateId)
            .orElseThrow(() -> new NotFoundException("존재하지 않는 템플릿입니다."));
    }
}

