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
    public TemplateQuestion saveOrUpdateQuestion(Long questionId, String questionValue) {
        if (Objects.isNull(questionId)) {
            return templateQuestionRepository.save(new TemplateQuestion(questionValue));
        }

        TemplateQuestion question = findById(questionId);
        question.updateValue(questionValue);

        return question;
    }

    private TemplateQuestion findById(long questionId) {
        return templateQuestionRepository.findById(questionId)
            .orElseThrow(() -> new NotFoundException("존재하지 않는 질문입니다."));
    }
}
