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
        void createTemplate() {
            // given
            // 템플릿 생성
            String templateTitle = "title";
            String templateDescription = "description";
            List<TemplateQuestionCreateRequest> questions = List.of(new TemplateQuestionCreateRequest("question1"),
                new TemplateQuestionCreateRequest("question2"));

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
            List<TemplateQuestionCreateRequest> questions = List.of(new TemplateQuestionCreateRequest("question1"),
                new TemplateQuestionCreateRequest("question2"));

            List<TemplateQuestion> expected = convertRequestToQuestions(questions);
            Template template = saveTemplate(member1, templateTitle, templateDescription, questions);

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
    @DisplayName("템플릿 전체 조회")
    class findAllTemplates {

        @Test
        @DisplayName("템플릿을 모두 조회한다.")
        void findAllTemplates() {
            // given
            // create template
            List<TemplateQuestionCreateRequest> questions1 = List.of(
                new TemplateQuestionCreateRequest("question1"),
                new TemplateQuestionCreateRequest("question2"));

            List<TemplateQuestionCreateRequest> questions2 = List.of(
                new TemplateQuestionCreateRequest("question3"),
                new TemplateQuestionCreateRequest("question4"));

            saveTemplate(member1, "title1", "description1", questions1);
            saveTemplate(member1, "title2", "description2", questions2);

            // when
            List<Template> templates = templateService.findAll();

            // then
            assertThat(templates).hasSize(2);
        }

    }

    @Nested
    @DisplayName("최신순 전체 템플릿 조회")
    class findAllOrderByLatest {

        @Test
        @DisplayName("전체 템플릿을 최신순으로 조회한다.")
        void findAllOrderByLatest() {
            // given
            // create template
            List<TemplateQuestionCreateRequest> questions1 = List.of(
                new TemplateQuestionCreateRequest("question1"),
                new TemplateQuestionCreateRequest("question2"));

            List<TemplateQuestionCreateRequest> questions2 = List.of(
                new TemplateQuestionCreateRequest("question3"),
                new TemplateQuestionCreateRequest("question4"));

            Template template1 = saveTemplate(member1, "title1", "description1", questions1);
            Template template2 = saveTemplate(member1, "title2", "description2", questions2);

            // when
            List<Template> templates = templateService.findAllOrderByLatest();

            // then
            assertAll(
                () -> assertThat(templates).hasSize(2),
                () -> assertThat(templates.get(0)).isEqualTo(template2),
                () -> assertThat(templates.get(1)).isEqualTo(template1)
            );

        }
    }

    @Nested
    @DisplayName("사용순 전체 템플릿 조회")
    class findAllOrderByTrend {

        @Test
        @DisplayName("전체 템플릿을 사용순으로 조회한다.")
        void findAllOrderByTrend() {
            // given
            // create template
            List<TemplateQuestionCreateRequest> questions1 = List.of(
                new TemplateQuestionCreateRequest("question1"),
                new TemplateQuestionCreateRequest("question2"));

            List<TemplateQuestionCreateRequest> questions2 = List.of(
                new TemplateQuestionCreateRequest("question3"),
                new TemplateQuestionCreateRequest("question4"));

            Template template1 = saveTemplate(member1, "title1", "description1", questions1);
            Template template2 = saveTemplate(member1, "title2", "description2", questions2);

            template2.increaseUsedCount();

            // when
            List<Template> templates = templateService.findAllOrderByTrend();

            // then
            assertAll(
                () -> assertThat(templates).hasSize(2),
                () -> assertThat(templates.get(0)).isEqualTo(template2),
                () -> assertThat(templates.get(1)).isEqualTo(template1)
            );

        }
    }

    @Nested
    @DisplayName("사용자별 템플릿 조회")
    class findTemplateByMember {

        @Test
        @DisplayName("사용자 작성한 템플릿을 수정시각을 기준으로 내림차순 정렬하여 조회한다.")
        void findBySocialId() {
            // given
            String templateTitle1 = "title1";
            String templateDescription1 = "description1";
            List<TemplateQuestionCreateRequest> questions1 = List.of(new TemplateQuestionCreateRequest("question1"),
                new TemplateQuestionCreateRequest("question2"));

            String templateTitle2 = "title2";
            String templateDescription2 = "description2";
            List<TemplateQuestionCreateRequest> questions2 = List.of(new TemplateQuestionCreateRequest("question3"),
                new TemplateQuestionCreateRequest("question3"));

            String templateTitle3 = "title3";
            String templateDescription3 = "description3";
            List<TemplateQuestionCreateRequest> questions3 = List.of(new TemplateQuestionCreateRequest("question5"),
                new TemplateQuestionCreateRequest("question6"));

            saveTemplate(member1, templateTitle1, templateDescription1, questions1);
            saveTemplate(member2, templateTitle2, templateDescription2, questions2);
            saveTemplate(member1, templateTitle3, templateDescription3, questions3);

            // when
            List<Template> myTemplates = templateService.findBySocialId(member1.getSocialId());

            List<TemplateQuestion> expectedTemplateQuestions = questions3.stream()
                .map(questionUpdateRequest -> new TemplateQuestion(questionUpdateRequest.getValue(), ""))
                .collect(Collectors.toUnmodifiableList());

            int index = 0;
            for (TemplateQuestion reviewFormQuestion : expectedTemplateQuestions) {
                reviewFormQuestion.setPosition(index++);
            }

            // then
            assertAll(
                () -> assertThat(myTemplates).hasSize(2),
                () -> assertThat(myTemplates.get(0)).isNotNull(),
                () -> assertThat(myTemplates.get(0).getMember().getNickname()).isEqualTo("제이슨"),
                () -> assertThat(myTemplates.get(0).getId()).isNotNull(),
                () -> assertThat(myTemplates.get(0).getTemplateTitle()).isEqualTo("title3"),
                () -> assertThat(myTemplates.get(0).getTemplateDescription()).isEqualTo("description3"),
                () -> assertThat(myTemplates.get(0).getQuestions())
                    .usingRecursiveComparison()
                    .ignoringFields("id")
                    .isEqualTo(expectedTemplateQuestions)
            );
        }

        @Test
        @DisplayName("존재하지 않는 사용자에 대해 조회할 수 없다.")
        void invalidSocialId() {
            // when, then
            assertThatThrownBy(() -> templateService.findBySocialId("999999"))
                .isInstanceOf(NotFoundException.class)
                .hasMessageContaining("존재하지 않는 사용자입니다.");
        }

    }

    @Nested
    @DisplayName("템플릿 수정")
    class updateTemplate {

        @Test
        @DisplayName("템플릿을 수정한다.")
        void updateTemplate() {
            // given
            // 템플릿 생성
            String templateTitle = "title";
            String templateDescription = "description";
            List<TemplateQuestionCreateRequest> questions = List.of(new TemplateQuestionCreateRequest("question1"),
                new TemplateQuestionCreateRequest("question2"));

            Template template = saveTemplate(member1, templateTitle, templateDescription, questions);

            // when
            List<TemplateQuestionUpdateRequest> newQuestions = List.of(
                new TemplateQuestionUpdateRequest(1L, "new question1"),
                new TemplateQuestionUpdateRequest(2L, "question2"),
                new TemplateQuestionUpdateRequest(null, "question3"));

            templateService.update(member1, template.getId(),
                new TemplateUpdateRequest("new title", "new description", newQuestions));

            List<TemplateQuestion> expectedTemplateQuestions = newQuestions.stream()
                .map(questionUpdateRequest -> new TemplateQuestion(questionUpdateRequest.getValue(), ""))
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
        void notMine() {
            // given
            // 템플릿 생성
            String templateTitle = "title";
            String templateDescription = "description";
            List<TemplateQuestionCreateRequest> questions = List.of(new TemplateQuestionCreateRequest("question1"),
                new TemplateQuestionCreateRequest("question2"));

            Template template = saveTemplate(member1, templateTitle, templateDescription, questions);

            // when
            List<TemplateQuestionUpdateRequest> newQuestions = List.of(
                new TemplateQuestionUpdateRequest(1L, "new question1"),
                new TemplateQuestionUpdateRequest(2L, "question2"),
                new TemplateQuestionUpdateRequest(null, "question3"));
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
        void deleteTemplate() {
            // given
            // 템플릿 생성
            String templateTitle = "title";
            String templateDescription = "description";
            List<TemplateQuestionCreateRequest> questions = List.of(new TemplateQuestionCreateRequest("question1"),
                new TemplateQuestionCreateRequest("question2"));

            Template template = saveTemplate(member1, templateTitle, templateDescription, questions);

            // when
            templateService.deleteById(member1, template.getId());

            // then
            assertThatThrownBy(() -> templateService.findById(template.getId()))
                .isInstanceOf(NotFoundException.class)
                .hasMessageContaining("존재하지 않는 템플릿입니다.");
        }

        @Test
        @DisplayName("본인이 생성한 템플릿이 아니면 삭제할 수 없다.")
        void notMine() {
            // given
            // 템플릿 생성
            String templateTitle = "title";
            String templateDescription = "description";
            List<TemplateQuestionCreateRequest> questions = List.of(new TemplateQuestionCreateRequest("question1"),
                new TemplateQuestionCreateRequest("question2"));

            Template template = saveTemplate(member1, templateTitle, templateDescription, questions);

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
            .map(questionRequest -> new TemplateQuestion(questionRequest.getValue(), ""))
            .collect(Collectors.toUnmodifiableList());

        int index = 0;
        for (TemplateQuestion templateQuestion : expected) {
            templateQuestion.setPosition(index++);
        }
        return expected;
    }

    private Template saveTemplate(Member member, String templateTitle, String templateDescription,
        List<TemplateQuestionCreateRequest> questions) {
        TemplateCreateRequest createRequest = new TemplateCreateRequest(templateTitle, templateDescription, questions);
        return templateService.save(member, createRequest);
    }

}
