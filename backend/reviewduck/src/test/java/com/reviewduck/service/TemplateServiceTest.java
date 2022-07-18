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

@SpringBootTest
@Transactional
public class TemplateServiceTest {

    private final String invalidCode = "aaaaaaaa";

    @Autowired
    private TemplateService templateService;

    @Test
    @DisplayName("회고 폼을 생성한다.")
    void createReviewForm() {
        // given
        String templateTitle = "title";
        String templateDescription = "description";
        List<QuestionRequest> questions = List.of(new QuestionRequest("question1"),
            new QuestionRequest("question2"));

        TemplateCreateRequest createRequest = new TemplateCreateRequest(templateTitle, templateDescription, questions);

        List<Question> expected = questions.stream()
            .map(questionRequest -> new Question(questionRequest.getQuestionValue()))
            .collect(Collectors.toList());

        int index = 0;
        for (Question question : expected) {
            question.setPosition(index++);
        }

        // when
        Template template = templateService.save(createRequest);

        // then
        assertAll(
            () -> assertThat(template).isNotNull(),
            () -> assertThat(template.getId()).isNotNull(),
            () -> assertThat(template.getCode().length()).isEqualTo(8),
            () -> assertThat(template.getTemplateTitle()).isEqualTo(templateTitle),
            () -> assertThat(template.getTemplateDescription()).isEqualTo(templateDescription),
            () -> assertThat(template.getQuestions())
                .usingRecursiveComparison()
                .ignoringFields("id")
                .isEqualTo(expected)
        );
    }
}
