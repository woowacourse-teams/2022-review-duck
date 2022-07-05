package com.reviewduck.repository;

import static org.assertj.core.api.Assertions.*;
import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import com.reviewduck.domain.Answer;

@DataJpaTest
public class AnswerRepositoryTest {

    @Autowired
    private AnswerRepository answerRepository;

    @Test
    @DisplayName("질문을 저장한다.")
    void saveAnswer() {
        // given
        Answer answer = new Answer("new answer");

        // when
        Answer savedAnswer = answerRepository.save(answer);

        // then
        assertAll(
            () -> assertThat(savedAnswer.getValue()).isEqualTo(answer.getValue()),
            () -> assertThat(savedAnswer.getId()).isNotNull()
        );
    }
}
