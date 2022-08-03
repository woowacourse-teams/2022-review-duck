package com.reviewduck.template.controller;

import static com.reviewduck.common.util.Logging.*;

import java.util.List;

import javax.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.reviewduck.auth.support.AuthenticationPrincipal;
import com.reviewduck.member.domain.Member;
import com.reviewduck.review.domain.ReviewForm;
import com.reviewduck.review.dto.request.ReviewFormCreateFromTemplateRequest;
import com.reviewduck.review.dto.response.ReviewFormCodeResponse;
import com.reviewduck.review.service.ReviewFormService;
import com.reviewduck.template.domain.Template;
import com.reviewduck.template.dto.request.TemplateCreateRequest;
import com.reviewduck.template.dto.request.TemplateUpdateRequest;
import com.reviewduck.template.dto.response.MyTemplatesResponse;
import com.reviewduck.template.dto.response.TemplateCreateResponse;
import com.reviewduck.template.dto.response.TemplateResponse;
import com.reviewduck.template.dto.response.TemplatesFindResponse;
import com.reviewduck.template.service.TemplateService;

import io.swagger.v3.oas.annotations.Operation;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/templates")
public class TemplateController {

    private final TemplateService templateService;
    private final ReviewFormService reviewFormService;

    public TemplateController(TemplateService templateService, ReviewFormService reviewFormService) {
        this.templateService = templateService;
        this.reviewFormService = reviewFormService;
    }

    @Operation(summary = "템플릿을 생성한다.")
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TemplateCreateResponse create(@AuthenticationPrincipal Member member,
        @RequestBody @Valid TemplateCreateRequest request) {

        info("/api/templates", "POST", request.toString());

        Template template = templateService.save(member, request);
        return TemplateCreateResponse.from(template);
    }

    @Operation(summary = "템플릿을 기반으로 회고 폼을 생성한다.")
    @PostMapping("/{templateId}/review-forms")
    @ResponseStatus(HttpStatus.CREATED)
    public ReviewFormCodeResponse createReviewFormFromTemplate(@AuthenticationPrincipal Member member,
        @PathVariable Long templateId,
        @RequestBody @Valid ReviewFormCreateFromTemplateRequest request) {

        info("/api/templates/" + templateId + "/review-forms", "POST", request.toString());

        ReviewForm reviewForm = reviewFormService.saveFromTemplate(member, templateId, request);
        return ReviewFormCodeResponse.from(reviewForm);
    }

    @Operation(summary = "특정 템플릿을 조회한다.")
    @GetMapping("/{templateId}")
    @ResponseStatus(HttpStatus.OK)
    public TemplateResponse find(@AuthenticationPrincipal Member member, @PathVariable Long templateId) {

        info("/api/templates/" + templateId, "GET", "");

        Template template = templateService.findById(templateId);
        return TemplateResponse.from(template);
    }

    @Operation(summary = "템플릿을 모두 조회한다.")
    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public TemplatesFindResponse findAll(@AuthenticationPrincipal Member member) {

        info("/api/templates", "GET", "");

        List<Template> templates = templateService.findAll();
        return TemplatesFindResponse.from(templates);
    }

    @Operation(summary = "템플릿을 삭제한다.")
    @DeleteMapping("/{templateId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@AuthenticationPrincipal Member member, @PathVariable Long templateId) {

        info("/api/templates/" + templateId, "DELETE", "");

        templateService.deleteById(member, templateId);
    }

    @Operation(summary = "템플릿을 수정한다.")
    @PutMapping("/{templateId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void update(@AuthenticationPrincipal Member member, @PathVariable Long templateId,
        @RequestBody @Valid TemplateUpdateRequest request) {

        info("/api/templates/" + templateId, "PUT", "");

        templateService.update(member, templateId, request);
    }

    @Operation(summary = "내가 작성한 템플릿을 모두 조회한다.")
    @GetMapping("/me")
    @ResponseStatus(HttpStatus.OK)
    public MyTemplatesResponse findByMember(@AuthenticationPrincipal Member member) {

        info("/api/templates/me", "GET", "");

        List<Template> templates = templateService.findByMember(member);

        return MyTemplatesResponse.from(templates);
    }
}
