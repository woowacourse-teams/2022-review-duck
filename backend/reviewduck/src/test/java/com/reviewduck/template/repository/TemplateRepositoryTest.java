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

import com.reviewduck.common.exception.NotFoundException;
import com.reviewduck.member.domain.Member;
import com.reviewduck.member.repository.MemberRepository;
import com.reviewduck.review.domain.ReviewFormQuestion;
import com.reviewduck.template.domain.Template;

@DataJpaTest
public class TemplateRepositoryTest {

    @Autowired
    private TemplateRepository templateRepository;
    @Autowired
    private MemberRepository memberRepository;

    private static Member member1;
    private static Member member2;

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
        List<String> questionValues = List.of("question1", "question2");
        List<ReviewFormQuestion> reviewFormQuestions = convertValuesToQuestions(questionValues);

        Template template = new Template(member1, "title", "description", questionValues);

        // when
        Template savedTemplate = templateRepository.save(template);

        // then
        assertAll(
            () -> assertThat(savedTemplate.getId()).isNotNull(),
            () -> assertThat(savedTemplate.getQuestions())
                .usingRecursiveComparison()
                .ignoringFields("id")
                .isEqualTo(reviewFormQuestions)
        );
    }

    @Test
    @DisplayName("템플릿을 조회한다.")
    void findTemplate() {
        // given
        List<String> questionValues = List.of("question1", "question2");
        List<ReviewFormQuestion> reviewFormQuestions = convertValuesToQuestions(questionValues);

        Template template = new Template(member1, "title", "description", questionValues);
        Template savedTemplate = templateRepository.save(template);

        // when
        Template foundTemplate = templateRepository.findById(savedTemplate.getId())
            .orElseThrow(() -> new NotFoundException("존재하지 않는 템플릿입니다."));

        // then
        assertAll(
            () -> assertThat(foundTemplate.getId()).isNotNull(),
            () -> assertThat(foundTemplate.getQuestions())
                .usingRecursiveComparison()
                .ignoringFields("id")
                .isEqualTo(reviewFormQuestions)
        );
    }

    @Test
    @DisplayName("템플릿을 모두 조회한다.")
    void findAllTemplates() {
        // given
        List<String> questionValues1 = List.of("question1", "question2");
        Template template1 = new Template(member1, "title1", "description1", questionValues1);
        templateRepository.save(template1);
        List<String> questionValues2 = List.of("question3", "question4");
        Template template2 = new Template(member1, "title2", "description2", questionValues2);
        templateRepository.save(template2);

        // when
        List<Template> templates = templateRepository.findAll();

        // then
        assertThat(templates).hasSize(2);
    }

    @Test
    @DisplayName("템플릿을 삭제한다.")
    void deleteTemplate() {
        // given
        List<String> questionValues = List.of("question1", "question2");
        Template template = new Template(member1, "title", "description", questionValues);
        Template savedTemplate = templateRepository.save(template);

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
        List<String> questionValues1 = List.of("question1", "question2");
        Template template1 = new Template(member1, "title1", "description1", questionValues1);

        List<String> questionValues2 = List.of("question3", "question4");
        Template template2 = new Template(member2, "title2", "description2", questionValues2);

        templateRepository.save(template1);
        templateRepository.save(template2);

        // when
        List<Template> myTemplates = templateRepository.findByMember(member2);
        List<ReviewFormQuestion> reviewFormQuestions = convertValuesToQuestions(questionValues2);

        // then
        assertAll(
            () -> assertThat(myTemplates).hasSize(1),
            () -> assertThat(myTemplates.get(0)).isNotNull(),
            () -> assertThat(myTemplates.get(0).getMember().getNickname()).isEqualTo("브리"),
            () -> assertThat(myTemplates.get(0).getTemplateTitle()).isEqualTo("title2"),
            () -> assertThat(myTemplates.get(0).getQuestions())
                .usingRecursiveComparison()
                .ignoringFields("id")
                .isEqualTo(reviewFormQuestions)
        );
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
