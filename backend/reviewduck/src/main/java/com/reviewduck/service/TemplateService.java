package com.reviewduck.service;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.reviewduck.domain.Question;
import com.reviewduck.domain.Template;
import com.reviewduck.dto.request.QuestionRequest;
import com.reviewduck.dto.request.TemplateCreateRequest;
import com.reviewduck.dto.request.TemplateUpdateRequest;
import com.reviewduck.exception.NotFoundException;
import com.reviewduck.repository.QuestionRepository;
import com.reviewduck.repository.TemplateRepository;

@Service
@Transactional
public class TemplateService {

    private final TemplateRepository templateRepository;
    private final QuestionRepository questionRepository;

    public TemplateService(TemplateRepository templateRepository,
        QuestionRepository questionRepository) {
        this.templateRepository = templateRepository;
        this.questionRepository = questionRepository;
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

    public Template update(Long id, TemplateUpdateRequest templateUpdateRequest) {
        Template template = findById(id);

        List<Question> questions = templateUpdateRequest.getQuestions().stream()
            .map(request -> saveOrUpdateQuestion(request.getQuestionId(), request.getQuestionValue()))
            .collect(Collectors.toUnmodifiableList());

        template.update(templateUpdateRequest.getTemplateTitle(), templateUpdateRequest.getTemplateDescription(),
            questions);

        return template;
    }

    private Question saveOrUpdateQuestion(Long questionId, String questionValue) {
        if (Objects.isNull(questionId)) {
            return questionRepository.save(new Question(questionValue));
        }

        Question question = questionRepository.findById(questionId)
            .orElseThrow(() -> new NotFoundException("존재하지 않는 질문입니다."));

        question.updateValue(questionValue);

        return question;
    }
}
