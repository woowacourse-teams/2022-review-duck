package com.reviewduck.template.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.reviewduck.template.domain.TemplateQuestion;

public interface TemplateQuestionRepository extends JpaRepository<TemplateQuestion, Long> {
}
