package com.reviewduck.template.repository;

import static org.assertj.core.api.Assertions.*;
import static org.junit.jupiter.api.Assertions.*;

import java.util.List;
import java.util.stream.Collectors;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.context.annotation.Import;

import com.reviewduck.common.exception.NotFoundException;
import com.reviewduck.config.JpaAuditingConfig;
import com.reviewduck.member.domain.Member;
import com.reviewduck.member.repository.MemberRepository;
import com.reviewduck.review.domain.ReviewFormQuestion;
import com.reviewduck.template.domain.Template;
import com.reviewduck.template.domain.TemplateQuestion;

@DataJpaTest
@Import(JpaAuditingConfig.class)
public class TemplateRepositoryTest {

    @Autowired
    private TemplateRepository templateRepository;
    @Autowired
    private MemberRepository memberRepository;

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
    void findTemplate() {
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
    @DisplayName("템플릿을 모두 조회한다.")
    void findAllTemplates() {
        // given
        List<TemplateQuestion> questions1 = List.of(
            new TemplateQuestion("question1", "description1"),
            new TemplateQuestion("question2", "description2")
        );
        List<TemplateQuestion> questions2 = List.of(
            new TemplateQuestion("question1", "description1"),
            new TemplateQuestion("question2", "description2")
        );
        saveTemplate(member1, questions1);
        saveTemplate(member2, questions2);

        // when
        List<Template> templates = templateRepository.findAll();

        // then
        assertThat(templates).hasSize(2);
    }

    @Test
    @DisplayName("템플릿을 삭제한다.")
    void deleteTemplate() {
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
    @DisplayName("개인이 작성한 템플릿을 조회한다.")
    void findByMember() {
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

        // when
        List<Template> myTemplates = templateRepository.findByMember(member2);

        // then
        assertAll(
            () -> assertThat(myTemplates).hasSize(1),
            () -> assertThat(myTemplates.get(0)).isNotNull(),
            () -> assertThat(myTemplates.get(0).getMember().getNickname()).isEqualTo("브리"),
            () -> assertThat(myTemplates.get(0).getQuestions())
                .usingRecursiveComparison()
                .ignoringFields("id")
                .isEqualTo(questions2)
        );
    }

    private Template saveTemplate(Member member, List<TemplateQuestion> questions) {
        Template template = new Template(member, "title", "description", questions);

        return templateRepository.save(template);
    }

    private List<ReviewFormQuestion> convertValuesToQuestions(List<String> questionValues) {
        List<ReviewFormQuestion> reviewFormQuestions = questionValues.stream()
            .map(ReviewFormQuestion::new)
            .collect(Collectors.toUnmodifiableList());

        int index = 0;
        for (ReviewFormQuestion reviewFormQuestion : reviewFormQuestions) {
            reviewFormQuestion.setPosition(index++);
        }
        return reviewFormQuestions;
    }
}
