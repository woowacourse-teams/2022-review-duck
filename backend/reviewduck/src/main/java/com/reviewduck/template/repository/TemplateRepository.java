package com.reviewduck.template.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import com.reviewduck.member.domain.Member;
import com.reviewduck.template.domain.Template;

public interface TemplateRepository extends JpaRepository<Template, Long> {

    Page<Template> findAll(Pageable pageable);

    Page<Template> findByMember(Pageable pageable, Member member);

    List<Template> findAllByMember(Member member);

    @Modifying
    @Query("update Template t set t.usedCount = t.usedCount + 1 where t.id = ?1")
    void increaseUsedCount(Long id);
}
