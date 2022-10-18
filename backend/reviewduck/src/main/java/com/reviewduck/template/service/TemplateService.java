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
import com.reviewduck.member.repository.MemberRepository;
import com.reviewduck.template.domain.Template;
import com.reviewduck.template.dto.controller.request.TemplateCreateRequest;
import com.reviewduck.template.dto.controller.request.TemplateUpdateRequest;
import com.reviewduck.template.dto.controller.response.MemberTemplatesResponse;
import com.reviewduck.template.dto.controller.response.TemplateResponse;
import com.reviewduck.template.dto.controller.response.TemplatesResponse;
import com.reviewduck.template.repository.TemplateRepository;
import com.reviewduck.template.vo.TemplateSortType;

import lombok.AllArgsConstructor;

@Service
@Transactional(readOnly = true)
@AllArgsConstructor
public class TemplateService {

    private final TemplateRepository templateRepository;
    private final MemberRepository memberRepository;

    @Transactional
    public TemplateDto save(Member member, TemplateCreateRequest createRequest) {
        Template template = new Template(
            member,
            createRequest.getTemplateTitle(),
            createRequest.getTemplateDescription(),
            toTemplateQuestionCreateDtos(createRequest.getQuestions())
        );

        Template savedTemplate = templateRepository.save(template);
        return TemplateDto.from(savedTemplate);
    }

    public TemplatesResponse search(String query, int page, int size, String sort, Member member) {
        String sortType = TemplateSortType.getSortBy(sort);
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, sortType));

        Page<Template> templates = templateRepository.findByTemplateTitleContaining(pageRequest, query);
        return TemplatesResponse.of(templates, member);
    }

    public TemplateResponse findById(final Long id, final Member member) {
        Template template = templateRepository.findById(id)
            .orElseThrow(() -> new NotFoundException("존재하지 않는 템플릿입니다."));

        return TemplateResponse.of(template, member);
    }

    public TemplateDto findById(final Long id) {
        Template template = templateRepository.findById(id)
            .orElseThrow(() -> new NotFoundException("존재하지 않는 템플릿입니다."));

        return TemplateDto.from(template);
    }

    public TemplatesResponse findAllByMember(int page, int size, String sort, Member member) {
        String sortType = TemplateSortType.getSortBy(sort);
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, sortType));

        Page<Template> templates = templateRepository.findAll(pageRequest);
        return TemplatesResponse.of(templates, member);
    }

    public MemberTemplatesResponse findAllBySocialId(String socialId, int page, int size, boolean isMine) {
        Member member = memberRepository.findBySocialId(socialId)
            .orElseThrow(() -> new NotFoundException("존재하지 않는 사용자입니다."));

        Sort sort = Sort.by(Sort.Direction.DESC, TemplateSortType.LATEST.getSortBy());
        PageRequest pageRequest = PageRequest.of(page, size, sort);

        Page<Template> templates = templateRepository.findByMember(pageRequest, member);
        return MemberTemplatesResponse.of(templates, socialId, isMine);
    }

    @Transactional
    public void update(Member member, Long id, TemplateUpdateRequest templateUpdateRequest) {
        Template template = templateRepository.findById(id)
            .orElseThrow(() -> new NotFoundException("존재하지 않는 템플릿입니다."));
        validateTemplateIsMine(template, member, "본인이 생성한 템플릿이 아니면 수정할 수 없습니다.");

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
    public void deleteById(Member member, Long id) {
        Template template = templateRepository.findById(id)
            .orElseThrow(() -> new NotFoundException("존재하지 않는 템플릿입니다."));
        validateTemplateIsMine(template, member, "본인이 생성한 템플릿이 아니면 삭제할 수 없습니다.");

        templateRepository.delete(template);
    }

    private void validateTemplateIsMine(Template template, Member member, String message) {
        if (!template.isMine(member)) {
            throw new AuthorizationException(message);
        }
    }
}
