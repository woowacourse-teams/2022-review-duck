package com.reviewduck.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.reviewduck.domain.Template;

public interface TemplateRepository extends JpaRepository<Template, Long> {
}
