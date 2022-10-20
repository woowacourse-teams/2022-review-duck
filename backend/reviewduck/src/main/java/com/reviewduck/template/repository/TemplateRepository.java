package com.reviewduck.template.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;

import com.reviewduck.member.domain.Member;
import com.reviewduck.template.domain.Template;

public interface TemplateRepository extends Repository<Template, Long> {

    Template save(Template template);

    Page<Template> findAll(Pageable pageable);

    Optional<Template> findById(long id);

    Page<Template> findByMember(Pageable pageable, Member member);

    List<Template> findAllByMember(Member member);

    @Query(nativeQuery = true,
        value = "select * from template where match(template_title) against(:query)",
        countQuery = "select count(*) from template where match(template_title) against(:query)"
    )
    Page<Template> findByTemplateTitleContaining(Pageable pageable, String query);

    void delete(Template template);

    @Modifying
    @Query("update Template t set t.usedCount = t.usedCount + 1 where t.id = ?1")
    void increaseUsedCount(long id);
}
