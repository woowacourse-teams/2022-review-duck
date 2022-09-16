package com.reviewduck.admin.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.repository.Repository;

import com.reviewduck.member.domain.Member;
import com.reviewduck.template.domain.Template;

public interface AdminTemplateRepository extends Repository<Template, Long> {

    List<Template> findAll();

    List<Template> findAllByMember(Member member);

    Optional<Template> findById(Long templateId);

    void deleteById(Long templateId);
}
