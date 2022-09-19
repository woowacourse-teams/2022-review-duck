package com.reviewduck.template.repository;

import java.util.Optional;

import org.springframework.data.repository.Repository;

import com.reviewduck.template.domain.TemplateQuestion;

public interface TemplateQuestionRepository extends Repository<TemplateQuestion, Long> {
    TemplateQuestion save(TemplateQuestion templateQuestion);

    Optional<TemplateQuestion> findById(long questionId);
}
