package com.reviewduck.controller;

import javax.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.reviewduck.domain.ReviewForm;
import com.reviewduck.domain.Template;
import com.reviewduck.dto.request.ReviewFormCreateFromTemplateRequest;
import com.reviewduck.dto.request.TemplateCreateRequest;
import com.reviewduck.dto.response.ReviewFormCodeResponse;
import com.reviewduck.dto.response.TemplateCodeResponse;
import com.reviewduck.service.ReviewFormService;
import com.reviewduck.service.TemplateService;

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
    public TemplateCodeResponse create(@RequestBody @Valid TemplateCreateRequest request) {

        log.info("uri={}, method = {}, request = {}",
            "/api/templates", "POST", request.toString());

        Template template = templateService.save(request);
        return TemplateCodeResponse.from(template);
    }

    @Operation(summary = "템플릿을 기반으로 회고 폼을 생성한다.")
    @PostMapping("/{templateCode}/review-forms")
    @ResponseStatus(HttpStatus.CREATED)
    public ReviewFormCodeResponse createReviewFormFromTemplate(@PathVariable String templateCode,
        @RequestBody @Valid ReviewFormCreateFromTemplateRequest request) {

        log.info("uri={}, method = {}, request = {}",
            "/api/templates/" + templateCode + "/review-forms", "POST", request.toString());

        ReviewForm reviewForm = reviewFormService.saveFromTemplate(templateCode, request);
        return ReviewFormCodeResponse.from(reviewForm);
    }

}
