package com.reviewduck.repository;

import static org.assertj.core.api.Assertions.*;
import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import com.reviewduck.domain.Question;

@DataJpaTest
public class QuestionRepositoryTest {

    @Autowired
    private QuestionRepository questionRepository;

    @Test
    @DisplayName("질문을 저장한다.")
    void saveQuestion() {
        // given
        Question question = new Question("new question");

        // when
        Question savedQuestion = questionRepository.save(question);

        // then
        assertAll(
            () -> assertThat(savedQuestion.getValue()).isEqualTo(question.getValue()),
            () -> assertThat(savedQuestion.getId()).isNotNull()
        );
    }
}
