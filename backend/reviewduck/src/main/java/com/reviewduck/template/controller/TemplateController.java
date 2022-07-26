package com.reviewduck.template.controller;

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

import com.reviewduck.review.domain.ReviewForm;
import com.reviewduck.template.domain.Template;
import com.reviewduck.review.dto.request.ReviewFormCreateFromTemplateRequest;
import com.reviewduck.template.dto.request.TemplateCreateRequest;
import com.reviewduck.template.dto.request.TemplateUpdateRequest;
import com.reviewduck.review.dto.response.ReviewFormCodeResponse;
import com.reviewduck.template.dto.response.TemplateCreateResponse;
import com.reviewduck.template.dto.response.TemplateResponse;
import com.reviewduck.template.dto.response.TemplatesFindResponse;
import com.reviewduck.review.service.ReviewFormService;
import com.reviewduck.template.service.TemplateService;

import io.swagger.v3.oas.annotations.Operation;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/templates")
@Slf4j
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
    public TemplateCreateResponse create(@RequestBody @Valid TemplateCreateRequest request) {

        log.info("uri={}, method = {}, request = {}",
            "/api/templates", "POST", request.toString());

        Template template = templateService.save(request);
        return TemplateCreateResponse.from(template);
    }

    @Operation(summary = "템플릿을 기반으로 회고 폼을 생성한다.")
    @PostMapping("/{templateId}/review-forms")
    @ResponseStatus(HttpStatus.CREATED)
    public ReviewFormCodeResponse createReviewFormFromTemplate(@PathVariable Long templateId,
        @RequestBody @Valid ReviewFormCreateFromTemplateRequest request) {

        log.info("uri={}, method = {}, request = {}",
            "/api/templates/" + templateId + "/review-forms", "POST", request.toString());

        ReviewForm reviewForm = reviewFormService.saveFromTemplate(templateId, request);
        return ReviewFormCodeResponse.from(reviewForm);
    }

    @Operation(summary = "템플릿을 조회한다.")
    @GetMapping("/{templateId}")
    @ResponseStatus(HttpStatus.OK)
    public TemplateResponse find(@PathVariable Long templateId) {

        log.info("uri={}, method = {}, request = {}",
            "/api/templates/" + templateId, "GET", "");

        Template template = templateService.findById(templateId);
        return TemplateResponse.from(template);
    }

    @Operation(summary = "템플릿을 모두 조회한다.")
    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public TemplatesFindResponse findAll() {

        log.info("uri={}, method = {}, request = {}",
            "/api/templates", "GET", "");

        List<Template> templates = templateService.findAll();
        return TemplatesFindResponse.from(templates);
    }

    @Operation(summary = "템플릿을 삭제한다.")
    @DeleteMapping("/{templateId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long templateId) {

        log.info("uri={}, method = {}, request = {}",
            "/api/templates/" + templateId, "DELETE", "");

        templateService.deleteById(templateId);
    }

    @Operation(summary = "템플릿을 수정한다.")
    @PutMapping("/{templateId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void update(@PathVariable Long templateId, @RequestBody @Valid TemplateUpdateRequest request) {

        log.info("uri={}, method = {}, request = {}",
            "/api/templates/" + templateId, "PUT", "");

        templateService.update(templateId, request);
    }
}