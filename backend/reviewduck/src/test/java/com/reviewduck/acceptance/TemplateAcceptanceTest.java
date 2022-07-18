package com.reviewduck.acceptance;

import static org.hamcrest.Matchers.*;

import java.util.List;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;

import com.reviewduck.dto.request.QuestionRequest;
import com.reviewduck.dto.request.TemplateCreateRequest;

public class TemplateAcceptanceTest extends AcceptanceTest {

    @Test
    @DisplayName("템플릿을 생성한다.")
    void createReviewForm() {
        // given
        String templateTitle = "title";
        String description = "test description";
        List<QuestionRequest> questions = List.of(new QuestionRequest("question1"),
            new QuestionRequest("question2"));
        TemplateCreateRequest request = new TemplateCreateRequest(templateTitle, description, questions);

        // when, then
        post("/api/templates", request).statusCode(HttpStatus.CREATED.value())
            .assertThat().body("templateCode", notNullValue());
    }
}
