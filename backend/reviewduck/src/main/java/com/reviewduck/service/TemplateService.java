package com.reviewduck.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.reviewduck.domain.Template;
import com.reviewduck.dto.request.QuestionRequest;
import com.reviewduck.dto.request.TemplateCreateRequest;
import com.reviewduck.exception.NotFoundException;
import com.reviewduck.repository.TemplateRepository;

@Service
@Transactional
public class TemplateService {

    private final TemplateRepository templateRepository;

    public TemplateService(TemplateRepository templateRepository) {
        this.templateRepository = templateRepository;
    }

    public Template save(TemplateCreateRequest createRequest) {
        List<String> questionValues = createRequest.getQuestions().stream()
            .map(QuestionRequest::getQuestionValue)
            .collect(Collectors.toUnmodifiableList());

        Template template = new Template(createRequest.getTemplateTitle(), createRequest.getTemplateDescription(),
            questionValues);
        return templateRepository.save(template);
    }

    @Transactional(readOnly = true)
    public Template findById(Long id) {
        return templateRepository.findById(id)
            .orElseThrow(() -> new NotFoundException("존재하지 않는 템플릿입니다."));
    }

    public List<Template> findAll() {
        return templateRepository.findAll();
    }

    public void deleteById(Long id) {
        Template template = findById(id);
        templateRepository.delete(template);
    }
}
