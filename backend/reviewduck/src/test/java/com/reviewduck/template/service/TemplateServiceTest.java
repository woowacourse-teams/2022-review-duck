package com.reviewduck.template.service;

import static org.assertj.core.api.Assertions.*;
import static org.junit.jupiter.api.Assertions.*;

import java.util.List;
import java.util.stream.Collectors;

import javax.transaction.Transactional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.jdbc.Sql;

import com.reviewduck.auth.exception.AuthorizationException;
import com.reviewduck.common.exception.NotFoundException;
import com.reviewduck.member.domain.Member;
import com.reviewduck.member.service.MemberService;
import com.reviewduck.template.domain.Template;
import com.reviewduck.template.domain.TemplateQuestion;
import com.reviewduck.template.dto.request.TemplateCreateRequest;
import com.reviewduck.template.dto.request.TemplateQuestionCreateRequest;
import com.reviewduck.template.dto.request.TemplateQuestionUpdateRequest;
import com.reviewduck.template.dto.request.TemplateUpdateRequest;

@SpringBootTest
@Sql("classpath:truncate.sql")
@Transactional
public class TemplateServiceTest {

    private final List<TemplateQuestionCreateRequest> questions1 = List.of(
        new TemplateQuestionCreateRequest("question1", "description1"),
        new TemplateQuestionCreateRequest("question2", "description2"));

    private final List<TemplateQuestionCreateRequest> questions2 = List.of(
        new TemplateQuestionCreateRequest("question3", "description3"),
        new TemplateQuestionCreateRequest("question4", "description4"));

    @Autowired
    private TemplateService templateService;

    @Autowired
    private MemberService memberService;

    private Member member1;
    private Member member2;

    @BeforeEach
    void createAndSaveMember() {
        Member tempMember1 = new Member("1", "panda", "제이슨", "testUrl1");
        member1 = memberService.save(tempMember1);

        Member tempMember2 = new Member("2", "ariari", "브리", "testUrl2");
        member2 = memberService.save(tempMember2);
    }

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

            List<TemplateQuestion> expected = convertRequestToQuestions(questions);

            // when
            Template template = saveTemplate(member1, templateTitle, templateDescription, questions);

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
            List<TemplateQuestionCreateRequest> questions = List.of(
                new TemplateQuestionCreateRequest("question1", "description1"),
                new TemplateQuestionCreateRequest("question2", "description2"));

            List<TemplateQuestion> expected = convertRequestToQuestions(questions);
            Template template = null;
            try {
                template = saveTemplate(member1, templateTitle, templateDescription, questions);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }

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
        @DisplayName("존재하지 않는 템플릿을 조회할 수 없다.")
        void findTemplateWithInvalidId() {
            // when, then
            assertThatThrownBy(() -> templateService.findById(9999L))
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
            Template template1 = saveTemplate(member1, "title1", "description1", questions1);
            Template template2 = saveTemplate(member1, "title2", "description2", questions2);

            templateService.increaseUsedCount(template1.getId());

            // when
            Integer page = 0;
            Integer size = 1;
            String sort = "trend";

            List<Template> templates = templateService.findAll(page, size, sort).getContent();

            // then
            assertAll(
                () -> assertThat(templates).hasSize(1),
                () -> assertThat(templates.get(0)).isEqualTo(template1)
            );
        }

        @Test
        @DisplayName("최신순으로 특정 페이지를 조회한다.")
        void findAllOrderByTrend() throws InterruptedException {
            // given
            // create template
            Template template1 = saveTemplate(member1, "title1", "description1", questions1);
            Template template2 = saveTemplate(member1, "title2", "description2", questions2);

            // when
            Integer page = 0;
            Integer size = 1;
            String sort = "latest";

            List<Template> templates = templateService.findAll(page, size, sort).getContent();

            // then
            assertAll(
                () -> assertThat(templates).hasSize(1),
                () -> assertThat(templates.get(0)).isEqualTo(template2)
            );
        }

        @Test
        @DisplayName("기본 크기의 페이지를 기본 정렬기준으로 조회한다.")
        void findPageDefault() throws InterruptedException {
            // given
            // create template

            // create 15 template1
            for (int i = 0; i < 15; i++) {
                saveTemplate(member1, "title1", "description1", questions1);
            }
            // create latestTemplate
            Template latestTemplate = saveTemplate(member1, "title2", "description2", questions2);

            // when
            List<Template> templates = templateService.findAll(null, null, null).getContent();

            // then
            assertAll(
                () -> assertThat(templates).hasSize(10),
                () -> assertThat(templates.get(0)).isEqualTo(latestTemplate)
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

            Template template1 = saveTemplate(member1, "title1", "description1", questions1);
            Template template2 = saveTemplate(member1, "title2", "description2", questions2);
            Template template3 = saveTemplate(member2, "title3", "description1", questions1);
            Template template4 = saveTemplate(member2, "title4", "description2", questions2);

            // when
            Integer page = 0;
            Integer size = 1;

            List<Template> templates = templateService.findAllBySocialId("1", page, size).getContent();

            // then
            assertAll(
                () -> assertThat(templates).hasSize(1),
                () -> assertThat(templates.get(0)).isEqualTo(template2)
            );
        }

        @Test
        @DisplayName("존재하지 않는 사용자에 대해 조회할 수 없다.")
        void invalidSocialId() {
            // when, then
            assertThatThrownBy(() -> templateService.findAllBySocialId("999999", 0, 1))
                .isInstanceOf(NotFoundException.class)
                .hasMessageContaining("존재하지 않는 사용자입니다.");
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

            Template template = saveTemplate(member1, templateTitle, templateDescription, questions1);

            // when
            List<TemplateQuestionUpdateRequest> newQuestions = List.of(
                new TemplateQuestionUpdateRequest(1L, "new question1", "new description1"),
                new TemplateQuestionUpdateRequest(2L, "question2", "description2"),
                new TemplateQuestionUpdateRequest(null, "question3", "description3"));

            templateService.update(member1, template.getId(),
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

            Template updatedTemplate = templateService.findById(template.getId());

            // then
            assertAll(
                () -> assertThat(updatedTemplate).isNotNull(),
                () -> assertThat(updatedTemplate.getId()).isNotNull(),
                () -> assertThat(updatedTemplate.getTemplateTitle()).isEqualTo("new title"),
                () -> assertThat(updatedTemplate.getTemplateDescription()).isEqualTo("new description"),
                () -> assertThat(updatedTemplate.getQuestions())
                    .usingRecursiveComparison()
                    .ignoringFields("id")
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

            Template template = saveTemplate(member1, templateTitle, templateDescription, questions1);

            // when
            List<TemplateQuestionUpdateRequest> newQuestions = List.of(
                new TemplateQuestionUpdateRequest(1L, "new question1", "new description1"),
                new TemplateQuestionUpdateRequest(2L, "question2", "description2"),
                new TemplateQuestionUpdateRequest(null, "question3", "description3"));
            TemplateUpdateRequest updateRequest = new TemplateUpdateRequest("new title", "new description",
                newQuestions);

            // then
            assertThatThrownBy(() -> templateService.update(member2, template.getId(), updateRequest))
                .isInstanceOf(AuthorizationException.class)
                .hasMessageContaining("본인이 생성한 템플릿이 아니면 수정할 수 없습니다.");
        }

        @Test
        @DisplayName("존재하지 않는 템플릿을 수정할 수 없다.")
        void invalidId() {
            // given
            TemplateUpdateRequest request = new TemplateUpdateRequest("title", "description", List.of());
            // when, then
            assertThatThrownBy(() -> templateService.update(member1, 9999L, request))
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

            Template template = saveTemplate(member1, templateTitle, templateDescription, questions1);

            // when
            templateService.deleteById(member1, template.getId());

            // then
            assertThatThrownBy(() -> templateService.findById(template.getId()))
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

            Template template = saveTemplate(member1, templateTitle, templateDescription, questions1);

            assertThatThrownBy(() -> templateService.deleteById(member2, template.getId()))
                .isInstanceOf(AuthorizationException.class)
                .hasMessageContaining("본인이 생성한 템플릿이 아니면 삭제할 수 없습니다.");
        }

        @Test
        @DisplayName("존재하지 않는 템플릿을 삭제할 수 없다.")
        void invalidId() {
            // when, then
            assertThatThrownBy(() -> templateService.deleteById(member1, 9999L))
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

    private Template saveTemplate(Member member, String templateTitle, String templateDescription,
        List<TemplateQuestionCreateRequest> questions) throws InterruptedException {
        Thread.sleep(1);
        TemplateCreateRequest createRequest = new TemplateCreateRequest(templateTitle, templateDescription, questions);
        return templateService.save(member, createRequest);
    }

}
