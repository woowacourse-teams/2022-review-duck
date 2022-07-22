package com.reviewduck.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.reviewduck.domain.TemplateQuestion;

public interface TemplateQuestionRepository extends JpaRepository<TemplateQuestion, Long> {
}
