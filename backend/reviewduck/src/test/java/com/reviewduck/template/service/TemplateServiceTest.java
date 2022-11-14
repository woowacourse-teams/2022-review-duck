package com.reviewduck.template.service;

import static org.assertj.core.api.Assertions.*;
import static org.junit.jupiter.api.Assertions.*;

import java.util.List;
import java.util.stream.Collectors;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

import com.reviewduck.auth.exception.AuthorizationException;
import com.reviewduck.common.exception.NotFoundException;
import com.reviewduck.common.service.ServiceTest;
import com.reviewduck.member.domain.Member;
import com.reviewduck.template.domain.Template;
import com.reviewduck.template.domain.TemplateQuestion;
import com.reviewduck.template.dto.controller.request.TemplateCreateRequest;
import com.reviewduck.template.dto.controller.request.TemplateQuestionCreateRequest;
import com.reviewduck.template.dto.controller.request.TemplateQuestionUpdateRequest;
import com.reviewduck.template.dto.controller.request.TemplateUpdateRequest;
import com.reviewduck.template.dto.controller.response.TemplateInfoResponse;
import com.reviewduck.template.dto.controller.response.TemplateResponse;
import com.reviewduck.template.dto.controller.response.TemplateSummaryResponse;

public class TemplateServiceTest extends ServiceTest {

    private final List<TemplateQuestionCreateRequest> questions1 = List.of(
        new TemplateQuestionCreateRequest("question1", "description1"),
        new TemplateQuestionCreateRequest("question2", "description2"));

    private final List<TemplateQuestionCreateRequest> questions2 = List.of(
        new TemplateQuestionCreateRequest("question3", "description3"),
        new TemplateQuestionCreateRequest("question4", "description4"));

    @Nested
    @DisplayName("템플릿 생성")
    class createTemplate {

        @Test
        @DisplayName("템플릿을 생성한다.")
        void createTemplate() throws InterruptedException {
            // given
            // 템플릿 생성
            String templateTitle = "title";
            String templateDescription = "description";
            List<TemplateQuestionCreateRequest> questions = List.of(
                new TemplateQuestionCreateRequest("question1", "description1"),
                new TemplateQuestionCreateRequest("question2", "description2"));

            // when
            TemplateResponse response = saveTemplate(member1, templateTitle, templateDescription, questions);
            TemplateInfoResponse savedTemplate = response.getInfo();
            List<TemplateQuestion> expected = convertRequestToQuestions(questions);

            // then
            assertAll(
                () -> assertThat(savedTemplate).isNotNull(),
                () -> assertThat(savedTemplate.getId()).isNotNull(),
                () -> assertThat(savedTemplate.getTitle()).isEqualTo(templateTitle),
                () -> assertThat(savedTemplate.getDescription()).isEqualTo(templateDescription),
                () -> assertThat(response.getQuestions())
                    .usingRecursiveComparison()
                    .ignoringFields("id", "template")
                    .isEqualTo(expected)
            );
        }

    }

    @Nested
    @DisplayName("템플릿 단일 조회")
    class findTemplate {

        @Test
        @DisplayName("템플릿을 조회한다.")
        void findTemplate() {
            // given
            // 템플릿 생성
            String templateTitle = "title";
            String templateDescription = "description";

            Long templateId = null;
            try {
                templateId = saveTemplate(member1, templateTitle, templateDescription,
                    questions1).getInfo().getId();
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            List<TemplateQuestion> expected = convertRequestToQuestions(questions1);

            // when
            TemplateResponse response = templateService.find(templateId, memberId1);
            TemplateInfoResponse foundTemplate = response.getInfo();

            // then
            assertAll(
                () -> assertThat(foundTemplate).isNotNull(),
                () -> assertThat(foundTemplate.getId()).isNotNull(),
                () -> assertThat(foundTemplate.getTitle()).isEqualTo(templateTitle),
                () -> assertThat(foundTemplate.getDescription()).isEqualTo(templateDescription),
                () -> assertThat(response.getQuestions())
                    .usingRecursiveComparison()
                    .ignoringFields("id", "template")
                    .isEqualTo(expected)
            );
        }

        @Test
        @DisplayName("존재하지 않는 템플릿을 조회할 수 없다.")
        void findTemplateWithInvalidId() {
            // when, then
            assertThatThrownBy(() -> templateService.find(9999L, memberId1))
                .isInstanceOf(NotFoundException.class)
                .hasMessageContaining("존재하지 않는 템플릿입니다.");
        }

    }

    @Nested
    @DisplayName("전체 템플릿 조회")
    class findAll {

        @Test
        @DisplayName("인기순으로 특정 페이지를 조회한다.")
        void findPageOrderByLatest() throws InterruptedException {
            // given
            // create template
            TemplateInfoResponse template1 = saveTemplate(member1, "title1", "description1", questions1)
                .getInfo();
            saveTemplate(member1, "title2", "description2", questions2);

            templateService.createReviewFormByTemplate(memberId1, template1.getId());

            // when
            int page = 0;
            int size = 1;
            String sort = "trend";

            List<TemplateSummaryResponse> templates = templateService.findAll(page, size, sort, memberId1)
                .getTemplates();
            TemplateInfoResponse firstTemplate = templates.get(0).getInfo();

            // then
            assertAll(
                () -> assertThat(templates).hasSize(1),
                () -> assertThat(firstTemplate.getId()).isEqualTo(template1.getId()),
                () -> assertThat(firstTemplate.getTitle()).isEqualTo(template1.getTitle())
            );
        }

        @Test
        @DisplayName("최신순으로 특정 페이지를 조회한다.")
        void findAllOrderByTrend() throws InterruptedException {
            // given
            // create template
            saveTemplate(member1, "title1", "description1", questions1);
            TemplateInfoResponse template2 = saveTemplate(member1, "title2", "description2", questions2).getInfo();

            // when
            int page = 0;
            int size = 1;
            String sort = "latest";

            List<TemplateSummaryResponse> templates = templateService.findAll(page, size, sort, memberId1)
                .getTemplates();
            TemplateInfoResponse firstTemplate = templates.get(0).getInfo();

            // then
            assertAll(
                () -> assertThat(templates).hasSize(1),
                () -> assertThat(firstTemplate.getId()).isEqualTo(template2.getId()),
                () -> assertThat(firstTemplate.getTitle()).isEqualTo(template2.getTitle())
            );
        }
    }

    @Nested
    @DisplayName("사용자별 템플릿 조회")
    class findAllByMember {

        @Test
        @DisplayName("특정 페이지를 조회한다.")
        void findAllByMember() throws InterruptedException {
            // given
            // create template

            saveTemplate(member1, "title1", "description1", questions1);
            TemplateInfoResponse template2 = saveTemplate(member1, "title2", "description2", questions2).getInfo();
            saveTemplate(member2, "title3", "description1", questions1);
            saveTemplate(member2, "title4", "description2", questions2);

            // when
            int page = 0;
            int size = 1;

            List<Template> templates = templateService.findAllByMember(page, size, member1).getContent();

            // then
            assertAll(
                () -> assertThat(templates).hasSize(1),
                () -> assertThat(templates.get(0).getId()).isEqualTo(template2.getId()),
                () -> assertThat(templates.get(0).getTemplateTitle()).isEqualTo(template2.getTitle())
            );
        }

    }

    @Nested
    @DisplayName("템플릿 수정")
    class updateTemplate {

        @Test
        @DisplayName("템플릿을 수정한다.")
        void updateTemplate() throws InterruptedException {
            // given
            // 템플릿 생성
            String templateTitle = "title";
            String templateDescription = "description";

            long templateId = saveTemplate(member1, templateTitle, templateDescription, questions1).getInfo()
                .getId();

            // when
            List<TemplateQuestionUpdateRequest> newQuestions = List.of(
                new TemplateQuestionUpdateRequest(1L, "new question1", "new description1"),
                new TemplateQuestionUpdateRequest(2L, "question2", "description2"),
                new TemplateQuestionUpdateRequest(null, "question3", "description3"));

            templateService.update(memberId1, templateId,
                new TemplateUpdateRequest("new title", "new description", newQuestions));

            List<TemplateQuestion> expectedTemplateQuestions = newQuestions.stream()
                .map(questionUpdateRequest -> new TemplateQuestion(
                    questionUpdateRequest.getValue(),
                    questionUpdateRequest.getDescription()))
                .collect(Collectors.toUnmodifiableList());

            int index = 0;
            for (TemplateQuestion reviewFormQuestion : expectedTemplateQuestions) {
                reviewFormQuestion.setPosition(index++);
            }

            TemplateResponse response = templateService.find(templateId, memberId1);
            TemplateInfoResponse updatedTemplate = response.getInfo();

            // then
            assertAll(
                () -> assertThat(updatedTemplate).isNotNull(),
                () -> assertThat(updatedTemplate.getId()).isNotNull(),
                () -> assertThat(updatedTemplate.getTitle()).isEqualTo("new title"),
                () -> assertThat(updatedTemplate.getDescription()).isEqualTo("new description"),
                () -> assertThat(response.getQuestions())
                    .usingRecursiveComparison()
                    .ignoringFields("id", "template")
                    .isEqualTo(expectedTemplateQuestions)
            );
        }

        @Test
        @DisplayName("본인이 생성한 템플릿이 아니면 수정할 수 없다.")
        void notMine() throws InterruptedException {
            // given
            // 템플릿 생성
            String templateTitle = "title";
            String templateDescription = "description";

            long templateId = saveTemplate(member1, templateTitle, templateDescription, questions1).getInfo()
                .getId();

            // when
            List<TemplateQuestionUpdateRequest> newQuestions = List.of(
                new TemplateQuestionUpdateRequest(1L, "new question1", "new description1"),
                new TemplateQuestionUpdateRequest(2L, "question2", "description2"),
                new TemplateQuestionUpdateRequest(null, "question3", "description3"));
            TemplateUpdateRequest updateRequest = new TemplateUpdateRequest("new title", "new description",
                newQuestions);

            // then
            assertThatThrownBy(() -> templateService.update(memberId2, templateId, updateRequest))
                .isInstanceOf(AuthorizationException.class)
                .hasMessageContaining("본인이 생성한 템플릿이 아니면 수정할 수 없습니다.");
        }

        @Test
        @DisplayName("존재하지 않는 템플릿을 수정할 수 없다.")
        void invalidId() {
            // given
            TemplateUpdateRequest request = new TemplateUpdateRequest("title", "description", List.of());
            // when, then
            assertThatThrownBy(() -> templateService.update(memberId1, 9999L, request))
                .isInstanceOf(NotFoundException.class)
                .hasMessageContaining("존재하지 않는 템플릿입니다.");
        }

    }

    @Nested
    @DisplayName("템플릿 삭제")
    class deleteTemplate {

        @Test
        @DisplayName("템플릿을 삭제한다.")
        void deleteTemplate() throws InterruptedException {
            // given
            // 템플릿 생성
            String templateTitle = "title";
            String templateDescription = "description";

            long templateId = saveTemplate(member1, templateTitle, templateDescription, questions1).getInfo()
                .getId();

            // when
            templateService.delete(memberId1, templateId);

            // then
            assertThatThrownBy(() -> templateService.find(templateId, memberId1))
                .isInstanceOf(NotFoundException.class)
                .hasMessageContaining("존재하지 않는 템플릿입니다.");
        }

        @Test
        @DisplayName("본인이 생성한 템플릿이 아니면 삭제할 수 없다.")
        void notMine() throws InterruptedException {
            // given
            // 템플릿 생성
            String templateTitle = "title";
            String templateDescription = "description";

            long templateId = saveTemplate(member1, templateTitle, templateDescription, questions1).getInfo()
                .getId();

            assertThatThrownBy(() -> templateService.delete(memberId2, templateId))
                .isInstanceOf(AuthorizationException.class)
                .hasMessageContaining("본인이 생성한 템플릿이 아니면 삭제할 수 없습니다.");
        }

        @Test
        @DisplayName("존재하지 않는 템플릿을 삭제할 수 없다.")
        void invalidId() {
            // when, then
            assertThatThrownBy(() -> templateService.delete(memberId1, 9999L))
                .isInstanceOf(NotFoundException.class)
                .hasMessageContaining("존재하지 않는 템플릿입니다.");
        }

    }

    private List<TemplateQuestion> convertRequestToQuestions(List<TemplateQuestionCreateRequest> questions) {
        List<TemplateQuestion> expected = questions.stream()
            .map(questionRequest -> new TemplateQuestion(questionRequest.getValue(), questionRequest.getDescription()))
            .collect(Collectors.toUnmodifiableList());

        int index = 0;
        for (TemplateQuestion templateQuestion : expected) {
            templateQuestion.setPosition(index++);
        }

        return expected;
    }

    private TemplateResponse saveTemplate(Member member, String templateTitle, String templateDescription,
        List<TemplateQuestionCreateRequest> questions) throws InterruptedException {
        Thread.sleep(1);
        TemplateCreateRequest request = new TemplateCreateRequest(templateTitle, templateDescription,
            questions);
        Long templateId = templateService.save(member.getId(), request).getTemplateId();
        return templateService.find(templateId, member.getId());
    }
}
