package com.reviewduck.template.repository;

import static org.assertj.core.api.Assertions.*;
import static org.junit.jupiter.api.Assertions.*;

import java.util.List;
import java.util.stream.Collectors;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import com.reviewduck.review.domain.ReviewFormQuestion;
import com.reviewduck.template.domain.Template;
import com.reviewduck.common.exception.NotFoundException;
import com.reviewduck.template.repository.TemplateRepository;

@DataJpaTest
public class TemplateRepositoryTest {

    @Autowired
    private TemplateRepository templateRepository;

    @Test
    @DisplayName("템플릿을 저장한다.")
    void saveTemplate() {
        // given
        List<String> questionValues = List.of("question1", "question2");
        List<ReviewFormQuestion> reviewFormQuestions = convertValuesToQuestions(questionValues);

        Template template = new Template("title", "description", questionValues);

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

        Template template = new Template("title", "description", questionValues);
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
        Template template1 = new Template("title1", "description1", questionValues1);
        templateRepository.save(template1);
        List<String> questionValues2 = List.of("question3", "question4");
        Template template2 = new Template("title2", "description2", questionValues2);
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
        Template template = new Template("title", "description", questionValues);
        Template savedTemplate = templateRepository.save(template);

        // when
        Long templateId = savedTemplate.getId();
        templateRepository.deleteById(templateId);

        // then
        assertThat(templateRepository.findById(templateId)).isEmpty();
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
