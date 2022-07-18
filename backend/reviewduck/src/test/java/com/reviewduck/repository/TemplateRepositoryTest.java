package com.reviewduck.repository;

import static org.assertj.core.api.Assertions.*;
import static org.junit.jupiter.api.Assertions.*;

import java.util.List;
import java.util.stream.Collectors;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import com.reviewduck.domain.Question;
import com.reviewduck.domain.Template;

@DataJpaTest
public class TemplateRepositoryTest {

    @Autowired
    private TemplateRepository templateRepository;

    @Test
    @DisplayName("템플릿을 저장한다.")
    void saveTemplate() {
        // given
        List<String> questionValues = List.of("question1", "question2");
        List<Question> questions = questionValues.stream()
            .map(Question::new)
            .collect(Collectors.toUnmodifiableList());

        int index = 0;
        for (Question question : questions) {
            question.setPosition(index++);
        }

        Template template = new Template("title", "description", questionValues);

        // when
        Template savedTemplate = templateRepository.save(template);

        // then
        assertAll(
            () -> assertThat(savedTemplate.getId()).isNotNull(),
            () -> assertThat(savedTemplate.getCode().length()).isEqualTo(8),
            () -> assertThat(savedTemplate.getQuestions())
                .usingRecursiveComparison()
                .ignoringFields("id")
                .isEqualTo(questions)
        );
    }
}
