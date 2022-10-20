package com.reviewduck.template.service;

import static com.reviewduck.template.dto.service.ServiceDtoConverter.*;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.reviewduck.auth.exception.AuthorizationException;
import com.reviewduck.common.exception.NotFoundException;
import com.reviewduck.member.domain.Member;
import com.reviewduck.template.domain.Template;
import com.reviewduck.template.dto.controller.request.TemplateCreateRequest;
import com.reviewduck.template.dto.controller.request.TemplateUpdateRequest;
import com.reviewduck.template.repository.TemplateRepository;
import com.reviewduck.template.vo.TemplateSortType;

import lombok.AllArgsConstructor;

@Service
@Transactional(readOnly = true)
@AllArgsConstructor
public class TemplateService {

    private final TemplateRepository templateRepository;

    @Transactional
    public Template save(Member member, TemplateCreateRequest createRequest) {
        Template template = new Template(
            member,
            createRequest.getTemplateTitle(),
            createRequest.getTemplateDescription(),
            toTemplateQuestionCreateDtos(createRequest.getQuestions())
        );

        return templateRepository.save(template);
    }

    public Page<Template> search(String query, int page, int size, String sort) {
        String sortType = TemplateSortType.getSortBy(sort);
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, sortType));

        return templateRepository.findByTemplateTitleContaining(pageRequest, query);
    }

    public Template findById(long id) {
        return templateRepository.findById(id)
            .orElseThrow(() -> new NotFoundException("존재하지 않는 템플릿입니다."));
    }

    public Page<Template> findAll(int page, int size, String sort) {
        String sortType = TemplateSortType.getSortBy(sort);
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, sortType));

        return templateRepository.findAll(pageRequest);
    }

    public Page<Template> findAllByMember(int page, int size, Member member) {
        Sort sort = Sort.by(Sort.Direction.DESC, TemplateSortType.LATEST.getSortBy());
        PageRequest pageRequest = PageRequest.of(page, size, sort);

        return templateRepository.findByMember(pageRequest, member);
    }

    @Transactional
    public void update(long memberId, Long id, TemplateUpdateRequest templateUpdateRequest) {
        Template template = templateRepository.findById(id)
            .orElseThrow(() -> new NotFoundException("존재하지 않는 템플릿입니다."));
        validateTemplateIsMine(template, memberId, "본인이 생성한 템플릿이 아니면 수정할 수 없습니다.");

        template.update(
            templateUpdateRequest.getTemplateTitle(),
            templateUpdateRequest.getTemplateDescription(),
            toTemplateQuestionUpdateDtos(templateUpdateRequest.getQuestions())
        );
    }

    @Transactional
    public void increaseUsedCount(Long templateId) {
        templateRepository.increaseUsedCount(templateId);
    }

    @Transactional
    public void deleteById(long memberId, Long id) {
        Template template = templateRepository.findById(id)
            .orElseThrow(() -> new NotFoundException("존재하지 않는 템플릿입니다."));
        validateTemplateIsMine(template, memberId, "본인이 생성한 템플릿이 아니면 삭제할 수 없습니다.");

        templateRepository.delete(template);
    }

    private void validateTemplateIsMine(Template template, long memberId, String message) {
        if (!template.isMine(memberId)) {
            throw new AuthorizationException(message);
        }
    }
}
