package com.reviewduck.template.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.reviewduck.auth.exception.AuthorizationException;
import com.reviewduck.common.exception.NotFoundException;
import com.reviewduck.member.domain.Member;
import com.reviewduck.template.domain.Template;
import com.reviewduck.template.domain.TemplateQuestion;
import com.reviewduck.template.dto.request.TemplateCreateRequest;
import com.reviewduck.template.dto.request.TemplateQuestionRequest;
import com.reviewduck.template.dto.request.TemplateUpdateRequest;
import com.reviewduck.template.repository.TemplateRepository;

import lombok.AllArgsConstructor;

@Service
@Transactional(readOnly = true)
@AllArgsConstructor
public class TemplateService {

    private final TemplateRepository templateRepository;

    private final TemplateQuestionService templateQuestionService;

    @Transactional
    public Template save(Member member, TemplateCreateRequest createRequest) {
        List<String> questionValues = createRequest.getQuestions().stream()
            .map(TemplateQuestionRequest::getQuestionValue)
            .collect(Collectors.toUnmodifiableList());

        Template template = new Template(member, createRequest.getTemplateTitle(),
            createRequest.getTemplateDescription(),
            questionValues);
        return templateRepository.save(template);
    }

    public Template findById(Long id) {
        return templateRepository.findById(id)
            .orElseThrow(() -> new NotFoundException("존재하지 않는 템플릿입니다."));
    }

    public List<Template> findByMember(Member member) {
        return templateRepository.findByMember(member);
    }

    public List<Template> findAll() {
        return templateRepository.findAll();
    }

    @Transactional
    public Template update(Member member, Long id, TemplateUpdateRequest templateUpdateRequest) {
        Template template = findById(id);

        validateTemplateIsMine(template, member, "본인이 생성한 템플릿이 아니면 수정할 수 없습니다.");

        List<TemplateQuestion> questions = templateUpdateRequest.getQuestions().stream()
            .map(request -> templateQuestionService.saveOrUpdateQuestion(request.getQuestionId(),
                request.getQuestionValue()))
            .collect(Collectors.toUnmodifiableList());

        template.update(templateUpdateRequest.getTemplateTitle(), templateUpdateRequest.getTemplateDescription(),
            questions);

        return template;
    }

    @Transactional
    public void deleteById(Member member, Long id) {
        Template template = findById(id);
        validateTemplateIsMine(template, member, "본인이 생성한 템플릿이 아니면 삭제할 수 없습니다.");

        templateRepository.delete(template);
    }

    private void validateTemplateIsMine(Template template, Member member, String message) {
        if (!template.isMine(member)) {
            throw new AuthorizationException(message);
        }
    }
}
