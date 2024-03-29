package com.reviewduck.review.repository;

import static org.assertj.core.api.Assertions.*;
import static org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase.Replace.*;

import java.util.Optional;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.jdbc.Sql;

import com.reviewduck.config.JpaAuditingConfig;
import com.reviewduck.config.datasource.CustomDatasourceConfig;
import com.reviewduck.config.datasource.DataSourceConfiguration;
import com.reviewduck.review.domain.ReviewFormQuestion;

@DataJpaTest
@Import({JpaAuditingConfig.class, DataSourceConfiguration.class, CustomDatasourceConfig.class})
@AutoConfigureTestDatabase(replace = NONE)
@Sql("classpath:truncate.sql")
public class ReviewFormQuestionRepositoryTest {

    @Autowired
    private ReviewFormQuestionRepository reviewFormQuestionRepository;

    @Test
    @DisplayName("존재하지 않는 질문을 조회하면 빈 Optional을 반환한다.")
    void findById() {
        // when
        Optional<ReviewFormQuestion> foundQuestion = reviewFormQuestionRepository.findById(9999L);

        // then
        assertThat(foundQuestion).isEmpty();
    }
}
