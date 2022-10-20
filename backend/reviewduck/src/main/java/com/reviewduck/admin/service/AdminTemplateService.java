package com.reviewduck.admin.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.reviewduck.admin.repository.AdminTemplateRepository;
import com.reviewduck.common.exception.NotFoundException;
import com.reviewduck.member.domain.Member;
import com.reviewduck.template.domain.Template;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor(access = AccessLevel.PROTECTED)
@Transactional(readOnly = true)
public class AdminTemplateService {

    private AdminMemberService adminMemberService;
    private AdminTemplateRepository templateRepository;

    public Template findById(long templateId) {
        return templateRepository.findById(templateId)
            .orElseThrow(() -> new NotFoundException("존재하지 않는 템플릿입니다."));
    }

    public List<Template> findAllTemplates() {
        return templateRepository.findAll();
    }

    public List<Template> findTemplatesByMemberId(long memberId) {
        Member member = adminMemberService.findMemberById(memberId);
        return templateRepository.findAllByMember(member);
    }

    @Transactional
    public void deleteTemplateById(long templateId) {
        templateRepository.findById(templateId)
            .orElseThrow(() -> new NotFoundException("존재하지 않는 템플릿입니다."));

        templateRepository.deleteById(templateId);
    }
}
