package com.reviewduck.template.dto.service;

import java.util.List;
import java.util.stream.Collectors;

import com.reviewduck.template.dto.controller.request.TemplateQuestionCreateRequest;

public class ServiceDtoConveter {

    public static List<TemplateQuestionCreateDto> toServiceDto(List<TemplateQuestionCreateRequest> questions) {
        return questions.stream()
            .map(TemplateQuestionCreateRequest::toServiceDto)
            .collect(Collectors.toUnmodifiableList());
    }

}
