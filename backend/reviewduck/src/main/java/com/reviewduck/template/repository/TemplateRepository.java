package com.reviewduck.template.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.reviewduck.template.domain.Template;

public interface TemplateRepository extends JpaRepository<Template, Long> {
}
