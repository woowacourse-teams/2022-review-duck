package com.reviewduck.template.repository;

import static org.assertj.core.api.Assertions.*;
import static org.junit.jupiter.api.Assertions.*;

import java.util.List;
import java.util.stream.Collectors;

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
import com.reviewduck.template.dto.service.TemplateQuestionCreateDto;

@DataJpaTest
@Import(JpaAuditingConfig.class)
public class TemplateRepositoryTest {

    private final List<TemplateQuestionCreateDto> questions1 = List.of(
        new TemplateQuestionCreateDto("question1", "description1"),
        new TemplateQuestionCreateDto("question2", "description2")
    );

    private final List<TemplateQuestionCreateDto> questions2 = List.of(
        new TemplateQuestionCreateDto("question3", "description3"),
        new TemplateQuestionCreateDto("question4", "description4")
    );

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
        Template template = new Template(member1, "title", "description", questions1);

        // when
        Template savedTemplate = templateRepository.save(template);

        // then
        assertAll(
            () -> assertThat(savedTemplate.getId()).isNotNull(),
            () -> assertThat(savedTemplate.getQuestions())
                .usingRecursiveComparison()
                .ignoringFields("id", "template")
                .isEqualTo(toEntity(questions1))
        );
    }

    @Test
    @DisplayName("템플릿을 조회한다.")
    void findTemplate() throws InterruptedException {
        // given
        Template savedTemplate = saveTemplate(member1, questions1);

        // when
        Template foundTemplate = templateRepository.findById(savedTemplate.getId())
            .orElseThrow(() -> new NotFoundException("존재하지 않는 템플릿입니다."));

        // then
        assertAll(
            () -> assertThat(foundTemplate.getId()).isNotNull(),
            () -> assertThat(foundTemplate.getQuestions())
                .usingRecursiveComparison()
                .ignoringFields("id", "template")
                .isEqualTo(toEntity(questions1))
        );
    }

    @Test
    @DisplayName("전체 템플릿 중 updatedAt 내림차순으로 정렬된 특정 페이지를 조회한다.")
    void findPages() throws InterruptedException {
        // given
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
    @DisplayName("특정 사용자가 작성한 템플릿 중 updatedAt 내림차순으로 정렬된 특정 페이지를 조회한다.")
    void findPagesByMemberOrderByUpdatedAt() throws InterruptedException {
        // given
        Template template1 = saveTemplate(member1, questions1);
        Template template2 = saveTemplate(member1, questions2);
        Template template3 = saveTemplate(member2, questions1);
        Template template4 = saveTemplate(member2, questions2);

        // when
        Pageable pageable = PageRequest.of(0, 1, Sort.by(Sort.Direction.DESC, "updatedAt"));
        List<Template> templates = templateRepository.findByMember(pageable, member1).getContent();

        // then
        assertAll(
            () -> assertThat(templates).hasSize(1),
            () -> assertThat(templates.get(0)).isEqualTo(template2)
        );
    }

    @Test
    @DisplayName("특정 문자열을 포함하는 템플릿을 검색한다.")
    void findByTemplateTitleContaining() {
        // given
        Template template1 = new Template(member1, "title1", "description1", questions1);
        templateRepository.save(template1);

        Template template2 = new Template(member2, "title2", "description2", questions2);
        templateRepository.save(template2);

        // when
        Pageable pageable = PageRequest.of(0, 1, Sort.by(Sort.Direction.DESC, "updatedAt"));
        List<Template> searched = templateRepository.findByTemplateTitleContaining(pageable, "title2").getContent();

        // then
        assertAll(
            () -> assertThat(searched).hasSize(1),
            () -> assertThat(searched.get(0).getQuestions())
                .usingRecursiveComparison()
                .ignoringFields("id", "template")
                .isEqualTo(toEntity(questions2))
        );
    }

    @Test
    @DisplayName("템플릿을 삭제한다.")
    void deleteTemplate() throws InterruptedException {
        // given
        Template savedTemplate = saveTemplate(member1, questions1);

        // when
        templateRepository.delete(savedTemplate);

        // then
        assertThat(templateRepository.findById(savedTemplate.getId())).isEmpty();
    }

    @Test
    @DisplayName("사용 횟수를 증가시킨다.")
    void increaseUsedCount() throws InterruptedException {
        //given
        Long templateId = saveTemplate(member1, questions1).getId();

        // when
        templateRepository.increaseUsedCount(templateId);

        Template template = templateRepository.findAllByMember(member1).get(0);

        // DB에 저장된 값과 1차 캐시의 Template을 동기화
        em.refresh(template);

        // then
        assertThat(template.getUsedCount()).isEqualTo(1);
    }

    private Template saveTemplate(Member member, List<TemplateQuestionCreateDto> questions) throws
        InterruptedException {
        Thread.sleep(1);
        Template template = new Template(member, "title", "description", questions);
        return templateRepository.save(template);
    }

    private List<TemplateQuestion> toEntity(List<TemplateQuestionCreateDto> dtos) {
        List<TemplateQuestion> questions = dtos.stream()
            .map(dto -> new TemplateQuestion(dto.getValue(), dto.getDescription()))
            .collect(Collectors.toUnmodifiableList());

        int position = 0;
        for (TemplateQuestion question : questions) {
            question.setPosition(position++);
        }
        return questions;
    }
}
