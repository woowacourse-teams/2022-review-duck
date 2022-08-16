package com.reviewduck.template.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.reviewduck.member.domain.Member;
import com.reviewduck.template.domain.Template;

public interface TemplateRepository extends JpaRepository<Template, Long> {

    List<Template> findByMemberOrderByUpdatedAtDesc(Member member);

}
