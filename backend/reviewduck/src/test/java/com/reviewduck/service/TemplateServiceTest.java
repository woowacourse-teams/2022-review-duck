package com.reviewduck.service;

import static org.assertj.core.api.Assertions.*;
import static org.junit.jupiter.api.Assertions.*;

import java.util.List;
import java.util.stream.Collectors;

import javax.transaction.Transactional;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.reviewduck.domain.Question;
import com.reviewduck.domain.Template;
import com.reviewduck.dto.request.QuestionRequest;
import com.reviewduck.dto.request.TemplateCreateRequest;
import com.reviewduck.exception.NotFoundException;

@SpringBootTest
@Transactional
public class TemplateServiceTest {

    @Autowired
    private TemplateService templateService;

    @Test
    @DisplayName("회고 폼을 생성한다.")
    void createReviewForm() {
        // given
        // 템플릿 생성
        String templateTitle = "title";
        String templateDescription = "description";
        List<QuestionRequest> questions = List.of(new QuestionRequest("question1"),
            new QuestionRequest("question2"));

        List<Question> expected = convertRequestToQuestions(questions);

        // when
        Template template = saveTemplate(templateTitle, templateDescription, questions);

        // then
        assertAll(
            () -> assertThat(template).isNotNull(),
            () -> assertThat(template.getId()).isNotNull(),
            () -> assertThat(template.getTemplateTitle()).isEqualTo(templateTitle),
            () -> assertThat(template.getTemplateDescription()).isEqualTo(templateDescription),
            () -> assertThat(template.getQuestions())
                .usingRecursiveComparison()
                .ignoringFields("id")
                .isEqualTo(expected)
        );
    }

    @Test
    @DisplayName("없는 템플릿을 조회하면 실패한다.")
    void findTemplateWithInvalidId() {
        // when, then
        assertThatThrownBy(() -> templateService.findById(9999L))
            .isInstanceOf(NotFoundException.class)
            .hasMessageContaining("존재하지 않는 템플릿입니다.");
    }

    @Test
    @DisplayName("템플릿을 조회한다.")
    void findTemplate() {
        // given
        // 템플릿 생성
        String templateTitle = "title";
        String templateDescription = "description";
        List<QuestionRequest> questions = List.of(new QuestionRequest("question1"),
            new QuestionRequest("question2"));

        List<Question> expected = convertRequestToQuestions(questions);
        Template template = saveTemplate(templateTitle, templateDescription, questions);

        // when
        Template foundTemplate = templateService.findById(template.getId());

        // then
        assertAll(
            () -> assertThat(foundTemplate).isNotNull(),
            () -> assertThat(foundTemplate.getId()).isNotNull(),
            () -> assertThat(foundTemplate.getTemplateTitle()).isEqualTo(templateTitle),
            () -> assertThat(foundTemplate.getTemplateDescription()).isEqualTo(templateDescription),
            () -> assertThat(foundTemplate.getQuestions())
                .usingRecursiveComparison()
                .ignoringFields("id")
                .isEqualTo(expected)
        );
    }

    @Test
    @DisplayName("템플릿을 모두 조회한다.")
    void findAllTemplates() {
        // given
        // 템플릿 생성
        List<QuestionRequest> questions1 = List.of(new QuestionRequest("question1"),
            new QuestionRequest("question2"));
        List<QuestionRequest> questions2 = List.of(new QuestionRequest("question3"),
            new QuestionRequest("question4"));
        saveTemplate("title1", "description1", questions1);
        saveTemplate("title2", "description2", questions2);

        // when
        List<Template> templates = templateService.findAll();

        // then
        assertThat(templates).hasSize(2);
    }

    @Test
    @DisplayName("없는 템플릿을 삭제하면 실패한다.")
    void deleteTemplateWithInvalidId() {
        // when, then
        assertThatThrownBy(() -> templateService.deleteById(9999L))
            .isInstanceOf(NotFoundException.class)
            .hasMessageContaining("존재하지 않는 템플릿입니다.");
    }

    @Test
    @DisplayName("템플릿을 삭제한다.")
    void deleteTemplate() {
        // given
        // 템플릿 생성
        String templateTitle = "title";
        String templateDescription = "description";
        List<QuestionRequest> questions = List.of(new QuestionRequest("question1"),
            new QuestionRequest("question2"));

        Template template = saveTemplate(templateTitle, templateDescription, questions);

        // when
        templateService.deleteById(template.getId());

        // then
        assertThatThrownBy(() -> templateService.findById(template.getId()))
            .isInstanceOf(NotFoundException.class)
            .hasMessageContaining("존재하지 않는 템플릿입니다.");
    }

    private List<Question> convertRequestToQuestions(List<QuestionRequest> questions) {
        List<Question> expected = questions.stream()
            .map(questionRequest -> new Question(questionRequest.getQuestionValue()))
            .collect(Collectors.toList());

        int index = 0;
        for (Question question : expected) {
            question.setPosition(index++);
        }
        return expected;
    }

    private Template saveTemplate(String templateTitle, String templateDescription, List<QuestionRequest> questions) {
        TemplateCreateRequest createRequest = new TemplateCreateRequest(templateTitle, templateDescription, questions);
        return templateService.save(createRequest);
    }

}
