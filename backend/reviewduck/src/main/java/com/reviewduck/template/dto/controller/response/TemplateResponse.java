package com.reviewduck.template.dto.controller.response;

import java.util.List;
import java.util.stream.Collectors;

import com.reviewduck.member.domain.Member;
import com.reviewduck.template.domain.Template;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class TemplateResponse {

    private boolean isCreator;
    private TemplateInfoResponse info;
    private CreatorResponse creator;
    private List<TemplateQuestionResponse> questions;

    public static TemplateResponse of(Template template, long memberId) {
        List<TemplateQuestionResponse> questions = template.getQuestions().stream()
            .map(TemplateQuestionResponse::from)
            .collect(Collectors.toUnmodifiableList());

        return new TemplateResponse(
            template.isMine(memberId),
            TemplateInfoResponse.from(template),
            CreatorResponse.from(template.getMember()),
            questions
        );
    }

    public boolean getIsCreator() {
        return isCreator;
    }
}
