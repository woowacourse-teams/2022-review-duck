package com.reviewduck.template.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.annotation.LastModifiedDate;

import com.reviewduck.member.domain.Member;
import com.reviewduck.template.domain.Template;
import com.reviewduck.template.dto.controller.response.TemplateQuestionResponse;
import com.reviewduck.template.dto.service.TemplateQuestionCreateDto;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class TemplateDto {

    private final Long id;
    private final Member member;
    private final String templateTitle;
    private final String templateDescription;
    private final List<TemplateQuestionResponse> questions;
    private final int usedCount;
    private final LocalDateTime createdAt;
    private final LocalDateTime updatedAt;

    public static TemplateDto from(Template template) {
        List<TemplateQuestionResponse> questions = template.getQuestions().stream()
            .map(TemplateQuestionResponse::from)
            .collect(Collectors.toUnmodifiableList());

        return new TemplateDto(
            template.getId(),
            template.getMember(),
            template.getTemplateTitle(),
            template.getTemplateDescription(),
            questions,
            template.getUsedCount(),
            template.getCreatedAt(),
            template.getUpdatedAt()
        );
    }

    public Template toEntity() {
        return new Template(id,
            member,
            templateTitle,
            templateDescription,
            questions.stream()
                .map(response -> new TemplateQuestionCreateDto(response.getValue(), response.getDescription()))
                .collect(Collectors.toUnmodifiableList()),
            usedCount);
    }
}
