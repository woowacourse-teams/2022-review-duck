package com.reviewduck.template.dto.service;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class TemplateQuestionCreateDto {

    private final String value;
    private final String description;
}
