package com.reviewduck.template.dto.service;

import java.util.List;
import java.util.stream.Collectors;

import com.reviewduck.template.dto.controller.request.TemplateQuestionCreateRequest;
import com.reviewduck.template.dto.controller.request.TemplateQuestionUpdateRequest;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class ServiceDtoConverter {

    public static List<TemplateQuestionCreateDto> toTemplateQuestionCreateDtos(
        List<TemplateQuestionCreateRequest> questions) {
        return questions.stream()
            .map(ServiceDtoConverter::toTemplateQuestionCreateDto)
            .collect(Collectors.toUnmodifiableList());
    }

    public static List<TemplateQuestionUpdateDto> toTemplateQuestionUpdateDtos(
        List<TemplateQuestionUpdateRequest> questions) {
        return questions.stream()
            .map(ServiceDtoConverter::toTemplateQuestionUpdateDto)
            .collect(Collectors.toUnmodifiableList());
    }

    private static TemplateQuestionCreateDto toTemplateQuestionCreateDto(TemplateQuestionCreateRequest question) {
        return new TemplateQuestionCreateDto(
            question.getValue(),
            question.getDescription()
        );
    }

    private static TemplateQuestionUpdateDto toTemplateQuestionUpdateDto(TemplateQuestionUpdateRequest question) {
        return new TemplateQuestionUpdateDto(
            question.getId(),
            question.getValue(),
            question.getDescription()
        );
    }

}
