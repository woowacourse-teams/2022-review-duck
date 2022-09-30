package com.reviewduck.template.dto.service;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class TemplateQuestionUpdateDto {

    private Long id;
    private String value;
    private String description;
}
