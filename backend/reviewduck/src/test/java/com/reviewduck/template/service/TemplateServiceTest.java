package com.reviewduck.template.service;

import static org.assertj.core.api.Assertions.*;
import static org.junit.jupiter.api.Assertions.*;

import java.util.List;
import java.util.stream.Collectors;

import javax.transaction.Transactional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
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
import com.reviewduck.template.dto.request.TemplateQuestionRequest;
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

    @Test
    @DisplayName("템플릿을 생성한다.")
    void createTemplate() {
        // given
        // 템플릿 생성
        String templateTitle = "title";
        String templateDescription = "description";
        List<TemplateQuestionRequest> questions = List.of(new TemplateQuestionRequest("question1"),
            new TemplateQuestionRequest("question2"));

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

    @Test
    @DisplayName("템플릿을 조회한다.")
    void findTemplate() {
        // given
        // 템플릿 생성
        String templateTitle = "title";
        String templateDescription = "description";
        List<TemplateQuestionRequest> questions = List.of(new TemplateQuestionRequest("question1"),
            new TemplateQuestionRequest("question2"));

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

    @Test
    @DisplayName("템플릿을 모두 조회한다.")
    void findAllTemplates() {
        // given
        // 템플릿 생성
        List<TemplateQuestionRequest> questions1 = List.of(new TemplateQuestionRequest("question1"),
            new TemplateQuestionRequest("question2"));
        List<TemplateQuestionRequest> questions2 = List.of(new TemplateQuestionRequest("question3"),
            new TemplateQuestionRequest("question4"));
        saveTemplate(member1, "title1", "description1", questions1);
        saveTemplate(member1, "title2", "description2", questions2);

        // when
        List<Template> templates = templateService.findAll();

        // then
        assertThat(templates).hasSize(2);
    }

    @Test
    @DisplayName("템플릿을 삭제한다.")
    void deleteTemplate() {
        // given
        // 템플릿 생성
        String templateTitle = "title";
        String templateDescription = "description";
        List<TemplateQuestionRequest> questions = List.of(new TemplateQuestionRequest("question1"),
            new TemplateQuestionRequest("question2"));

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
    void failToDeleteNotMyTemplate() {
        // given
        // 템플릿 생성
        String templateTitle = "title";
        String templateDescription = "description";
        List<TemplateQuestionRequest> questions = List.of(new TemplateQuestionRequest("question1"),
            new TemplateQuestionRequest("question2"));

        Template template = saveTemplate(member1, templateTitle, templateDescription, questions);

        assertThatThrownBy(() -> templateService.deleteById(member2, template.getId()))
            .isInstanceOf(AuthorizationException.class)
            .hasMessageContaining("본인이 생성한 템플릿이 아니면 삭제할 수 없습니다.");
    }

    @Test
    @DisplayName("존재하지 않는 템플릿을 삭제할 수 없다.")
    void deleteTemplateWithInvalidId() {
        // when, then
        assertThatThrownBy(() -> templateService.deleteById(member1, 9999L))
            .isInstanceOf(NotFoundException.class)
            .hasMessageContaining("존재하지 않는 템플릿입니다.");
    }

    @Test
    @DisplayName("템플릿을 수정한다.")
    void updateTemplate() {
        // given
        // 템플릿 생성
        String templateTitle = "title";
        String templateDescription = "description";
        List<TemplateQuestionRequest> questions = List.of(new TemplateQuestionRequest("question1"),
            new TemplateQuestionRequest("question2"));

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
    void failToUpdateNotMyTemplate() {
        // given
        // 템플릿 생성
        String templateTitle = "title";
        String templateDescription = "description";
        List<TemplateQuestionRequest> questions = List.of(new TemplateQuestionRequest("question1"),
            new TemplateQuestionRequest("question2"));

        Template template = saveTemplate(member1, templateTitle, templateDescription, questions);

        // when
        List<TemplateQuestionUpdateRequest> newQuestions = List.of(
            new TemplateQuestionUpdateRequest(1L, "new question1"),
            new TemplateQuestionUpdateRequest(2L, "question2"),
            new TemplateQuestionUpdateRequest(null, "question3"));
        TemplateUpdateRequest updateRequest = new TemplateUpdateRequest("new title", "new description", newQuestions);

        // then
        assertThatThrownBy(() -> templateService.update(member2, template.getId(), updateRequest))
            .isInstanceOf(AuthorizationException.class)
            .hasMessageContaining("본인이 생성한 템플릿이 아니면 수정할 수 없습니다.");
    }

    @Test
    @DisplayName("존재하지 않는 템플릿을 수정할 수 없다.")
    void updateTemplateWithInvalidId() {
        // given
        TemplateUpdateRequest request = new TemplateUpdateRequest("title", "description", List.of());
        // when, then
        assertThatThrownBy(() -> templateService.update(member1, 9999L, request))
            .isInstanceOf(NotFoundException.class)
            .hasMessageContaining("존재하지 않는 템플릿입니다.");
    }

    @Test
    @DisplayName("개인이 작성한 템플릿을 조회한다.")
    void findMyTemplates() {
        // given
        String templateTitle1 = "title1";
        String templateDescription1 = "description1";
        List<TemplateQuestionRequest> questions1 = List.of(new TemplateQuestionRequest("question1"),
            new TemplateQuestionRequest("question2"));

        String templateTitle2 = "title2";
        String templateDescription2 = "description2";
        List<TemplateQuestionRequest> questions2 = List.of(new TemplateQuestionRequest("question3"),
            new TemplateQuestionRequest("question3"));

        saveTemplate(member1, templateTitle1, templateDescription1, questions1);
        saveTemplate(member2, templateTitle2, templateDescription2, questions2);

        // when
        List<Template> myTemplates = templateService.findByMember(member2);

        List<TemplateQuestion> expectedTemplateQuestions = questions2.stream()
            .map(questionUpdateRequest -> new TemplateQuestion(questionUpdateRequest.getValue(), ""))
            .collect(Collectors.toUnmodifiableList());

        int index = 0;
        for (TemplateQuestion reviewFormQuestion : expectedTemplateQuestions) {
            reviewFormQuestion.setPosition(index++);
        }
        // then
        assertAll(
            () -> assertThat(myTemplates).hasSize(1),
            () -> assertThat(myTemplates.get(0)).isNotNull(),
            () -> assertThat(myTemplates.get(0).getMember().getNickname()).isEqualTo("브리"),
            () -> assertThat(myTemplates.get(0).getId()).isNotNull(),
            () -> assertThat(myTemplates.get(0).getTemplateTitle()).isEqualTo("title2"),
            () -> assertThat(myTemplates.get(0).getTemplateDescription()).isEqualTo("description2"),
            () -> assertThat(myTemplates.get(0).getQuestions())
                .usingRecursiveComparison()
                .ignoringFields("id")
                .isEqualTo(expectedTemplateQuestions)
        );
    }

    private List<TemplateQuestion> convertRequestToQuestions(List<TemplateQuestionRequest> questions) {
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
        List<TemplateQuestionRequest> questions) {
        TemplateCreateRequest createRequest = new TemplateCreateRequest(templateTitle, templateDescription, questions);
        return templateService.save(member, createRequest);
    }

}
