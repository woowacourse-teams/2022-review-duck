package com.reviewduck.template.service;

import java.util.Objects;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.reviewduck.common.exception.NotFoundException;
import com.reviewduck.template.domain.TemplateQuestion;
import com.reviewduck.template.repository.TemplateQuestionRepository;

import lombok.AllArgsConstructor;

@Service
@Transactional(readOnly = true)
@AllArgsConstructor
public class TemplateQuestionService {

    private final TemplateQuestionRepository templateQuestionRepository;

    @Transactional
    public TemplateQuestion save(String value, String description) {
        return templateQuestionRepository.save(new TemplateQuestion(value, description));
    }

    @Transactional
    public TemplateQuestion saveOrUpdateQuestion(Long id, String value, String description) {
        if (Objects.isNull(id)) {
            return templateQuestionRepository.save(new TemplateQuestion(value, description));
        }

        TemplateQuestion question = findById(id);
        question.update(value, description);

        return question;
    }

    private TemplateQuestion findById(long questionId) {
        return templateQuestionRepository.findById(questionId)
            .orElseThrow(() -> new NotFoundException("존재하지 않는 질문입니다."));
    }
}
