package com.reviewduck.template.repository;

import static org.assertj.core.api.Assertions.*;
import static org.junit.jupiter.api.Assertions.*;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.context.annotation.Import;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import com.reviewduck.common.exception.NotFoundException;
import com.reviewduck.config.JpaAuditingConfig;
import com.reviewduck.member.domain.Member;
import com.reviewduck.member.repository.MemberRepository;
import com.reviewduck.template.domain.Template;
import com.reviewduck.template.domain.TemplateQuestion;

@DataJpaTest
@Import(JpaAuditingConfig.class)
public class TemplateRepositoryTest {

    @Autowired
    private TemplateRepository templateRepository;
    @Autowired
    private MemberRepository memberRepository;

    @PersistenceContext
    private EntityManager em;

    private Member member1;
    private Member member2;

    @BeforeEach
    void createAndSaveMember() {
        Member tempMember1 = new Member("1", "panda", "제이슨", "testUrl1");
        member1 = memberRepository.save(tempMember1);

        Member tempMember2 = new Member("2", "ariari", "브리", "testUrl2");
        member2 = memberRepository.save(tempMember2);
    }

    @Test
    @DisplayName("템플릿을 저장한다.")
    void saveTemplate() {
        // given
        List<TemplateQuestion> questions = List.of(
            new TemplateQuestion("question1", "description1"),
            new TemplateQuestion("question2", "description2")
        );
        Template template = new Template(member1, "title", "description", questions);

        // when
        Template savedTemplate = templateRepository.save(template);

        // then
        assertAll(
            () -> assertThat(savedTemplate.getId()).isNotNull(),
            () -> assertThat(savedTemplate.getQuestions())
                .usingRecursiveComparison()
                .ignoringFields("id")
                .isEqualTo(questions)
        );
    }

    @Test
    @DisplayName("템플릿을 조회한다.")
    void findTemplate() throws InterruptedException {
        // given
        List<TemplateQuestion> questions = List.of(
            new TemplateQuestion("question1", "description1"),
            new TemplateQuestion("question2", "description2")
        );
        Template savedTemplate = saveTemplate(member1, questions);

        // when
        Template foundTemplate = templateRepository.findById(savedTemplate.getId())
            .orElseThrow(() -> new NotFoundException("존재하지 않는 템플릿입니다."));

        // then
        assertAll(
            () -> assertThat(foundTemplate.getId()).isNotNull(),
            () -> assertThat(foundTemplate.getQuestions())
                .usingRecursiveComparison()
                .ignoringFields("id")
                .isEqualTo(questions)
        );
    }

    @Test
    @DisplayName("템플릿을 updatedAt 내림차순으로 정렬하여 모두 조회한다.")
    void findAllTemplatesOrderByUpdatedAt() throws InterruptedException {
        // given
        List<TemplateQuestion> questions1 = List.of(
            new TemplateQuestion("question1", "description1"),
            new TemplateQuestion("question2", "description2")
        );
        List<TemplateQuestion> questions2 = List.of(
            new TemplateQuestion("question3", "description3"),
            new TemplateQuestion("question4", "description4")
        );
        Template template1 = saveTemplate(member1, questions1);
        Template template2 = saveTemplate(member2, questions2);

        // when
        List<Template> templates = templateRepository.findAllByOrderByUpdatedAtDesc();

        // then
        assertAll(
            () -> assertThat(templates).hasSize(2),
            () -> assertThat(templates.get(0)).isEqualTo(template2),
            () -> assertThat(templates.get(1)).isEqualTo(template1)
        );

    }

    @Test
    @DisplayName("템플릿을 updatedAt 내림차순으로 정렬된 특정 페이지를 조회한다.")
    void findPageOfTemplatesOrderByUpdatedAt() throws InterruptedException {
        // given
        List<TemplateQuestion> questions1 = List.of(
            new TemplateQuestion("question1", "description1"),
            new TemplateQuestion("question2", "description2")
        );
        List<TemplateQuestion> questions2 = List.of(
            new TemplateQuestion("question3", "description3"),
            new TemplateQuestion("question4", "description4")
        );
        Template template1 = saveTemplate(member1, questions1);
        Template template2 = saveTemplate(member2, questions2);

        // when
        Pageable pageable = PageRequest.of(0, 1, Sort.by(Sort.Direction.DESC, "updatedAt"));
        List<Template> templates = templateRepository.findAll(pageable).getContent();

        // then
        assertAll(
            () -> assertThat(templates).hasSize(1),
            () -> assertThat(templates.get(0)).isEqualTo(template2)
        );

    }

    @Test
    @DisplayName("템플릿을 usedCount 내림차순으로 정렬하여 모두 조회한다.")
    void findAllTemplatesOrderByUsedCount() throws InterruptedException {
        // given
        List<TemplateQuestion> questions1 = List.of(
            new TemplateQuestion("question1", "description1"),
            new TemplateQuestion("question2", "description2")
        );
        List<TemplateQuestion> questions2 = List.of(
            new TemplateQuestion("question3", "description3"),
            new TemplateQuestion("question4", "description4")
        );
        Template template1 = saveTemplate(member1, questions1);
        Template template2 = saveTemplate(member2, questions2);

        templateRepository.increaseUsedCount(template2.getId());

        // when
        List<Template> templates = templateRepository.findAllByOrderByUsedCountDesc();

        // then
        assertAll(
            () -> assertThat(templates).hasSize(2),
            () -> assertThat(templates.get(0)).isEqualTo(template2),
            () -> assertThat(templates.get(1)).isEqualTo(template1)
        );

    }

    @Test
    @DisplayName("특정 사용자가 작성한 템플릿을 updatedAt 내림차순으로 정렬하여 조회한다.")
    void findByMemberOrderByUpdatedAtDesc() throws InterruptedException {
        // given
        List<TemplateQuestion> questions1 = List.of(
            new TemplateQuestion("question1", "description1"),
            new TemplateQuestion("question2", "description2")
        );
        saveTemplate(member1, questions1);

        List<TemplateQuestion> questions2 = List.of(
            new TemplateQuestion("question3", "description3"),
            new TemplateQuestion("question4", "description4")
        );
        saveTemplate(member2, questions2);

        List<TemplateQuestion> questions3 = List.of(
            new TemplateQuestion("question5", "description5"),
            new TemplateQuestion("question6", "description6")
        );
        saveTemplate(member1, questions3);

        // when
        List<Template> myTemplates = templateRepository.findByMemberOrderByUpdatedAtDesc(member1);

        // then
        assertAll(
            () -> assertThat(myTemplates).hasSize(2),
            () -> assertThat(myTemplates.get(0)).isNotNull(),
            () -> assertThat(myTemplates.get(0).getMember().getNickname()).isEqualTo("제이슨"),
            () -> assertThat(myTemplates.get(0).getQuestions())
                .usingRecursiveComparison()
                .ignoringFields("id")
                .isEqualTo(questions3)
        );
    }

    @Test
    @DisplayName("템플릿을 삭제한다.")
    void deleteTemplate() throws InterruptedException {
        // given
        List<TemplateQuestion> questions = List.of(
            new TemplateQuestion("question1", "description1"),
            new TemplateQuestion("question2", "description2")
        );
        Template savedTemplate = saveTemplate(member1, questions);

        // when
        Long templateId = savedTemplate.getId();
        templateRepository.deleteById(templateId);

        // then
        assertThat(templateRepository.findById(templateId)).isEmpty();
    }

    @Test
    @DisplayName("사용 횟수를 증가시킨다.")
    void increaseUsedCount() throws InterruptedException {
        // given
        List<TemplateQuestion> questions = List.of(
            new TemplateQuestion("question1", "description1"),
            new TemplateQuestion("question2", "description2")
        );
        Long templateId = saveTemplate(member1, questions).getId();

        // when
        templateRepository.increaseUsedCount(templateId);

        Template template = templateRepository.findAllByMember(member1).get(0);

        // DB에 저장된 값과 1차 캐시의 Template을 동기화
        em.refresh(template);

        // then
        assertThat(template.getUsedCount()).isEqualTo(1);
    }

    private Template saveTemplate(Member member, List<TemplateQuestion> questions) throws InterruptedException {
        Thread.sleep(1);
        Template template = new Template(member, "title", "description", questions);

        return templateRepository.save(template);
    }
}
