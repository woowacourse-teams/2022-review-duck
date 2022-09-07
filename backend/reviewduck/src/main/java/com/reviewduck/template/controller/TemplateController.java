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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.reviewduck.auth.support.AuthenticationPrincipal;
import com.reviewduck.member.domain.Member;
import com.reviewduck.review.domain.ReviewForm;
import com.reviewduck.review.dto.response.ReviewFormCodeResponse;
import com.reviewduck.review.service.ReviewFormService;
import com.reviewduck.template.domain.Template;
import com.reviewduck.template.dto.request.TemplateCreateRequest;
import com.reviewduck.template.dto.request.TemplateUpdateRequest;
import com.reviewduck.template.dto.response.MemberTemplatesResponse;
import com.reviewduck.template.dto.response.TemplateIdResponse;
import com.reviewduck.template.dto.response.TemplateResponse;
import com.reviewduck.template.dto.response.TemplatesResponse;
import com.reviewduck.template.service.TemplateService;

import io.swagger.v3.oas.annotations.Operation;
import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/api/templates")
@AllArgsConstructor
public class TemplateController {

    private final TemplateService templateService;
    private final ReviewFormService reviewFormService;

    @Operation(summary = "템플릿을 생성한다.")
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TemplateIdResponse create(@AuthenticationPrincipal Member member,
        @RequestBody @Valid TemplateCreateRequest request) {

        info("/api/templates", "POST", request.toString());

        Template template = templateService.save(member, request);
        return TemplateIdResponse.from(template);
    }

    @Operation(summary = "템플릿을 기반으로 회고 폼을 생성한다.")
    @PostMapping("/{templateId}/review-forms")
    @ResponseStatus(HttpStatus.CREATED)
    public ReviewFormCodeResponse createReviewFormByTemplate(@AuthenticationPrincipal Member member,
        @PathVariable Long templateId) {

        info("/api/templates/" + templateId + "/review-forms", "POST", "");

        ReviewForm reviewForm = reviewFormService.saveFromTemplate(member, templateId);
        return ReviewFormCodeResponse.from(reviewForm);
    }

    @Operation(summary = "전체 템플릿을 조회한다.")
    @GetMapping("/new")
    @ResponseStatus(HttpStatus.OK)
    public TemplatesResponse findAll(@AuthenticationPrincipal Member member,
        @RequestParam(required = false) Integer page,
        @RequestParam(required = false) Integer size,
        @RequestParam(required = false) String sort) {

        info("/api/templates", "GET", "page=" + page + " size=" + size + " sort=" + sort);

        List<Template> templates = templateService.findAll(page, size, sort);
        return TemplatesResponse.of(templates, member);
    }

    @Operation(summary = "사용자가 생성한 템플릿을 모두 조회한다.")
    @GetMapping(path = "/new", params = "member")
    @ResponseStatus(HttpStatus.OK)
    public MemberTemplatesResponse findAllByMemberId(@AuthenticationPrincipal Member member,
        @RequestParam(value = "member") String socialId,
        @RequestParam(required = false) Integer page,
        @RequestParam(required = false) Integer size) {

        info("/api/templates?member=" + socialId, "GET", "page=" + page + " size=" + size);

        List<Template> templates = templateService.findAllBySocialId(socialId, page, size);

        return MemberTemplatesResponse.of(templates, socialId, member);
    }

    @Operation(summary = "특정 템플릿을 조회한다.")
    @GetMapping("/{templateId}")
    @ResponseStatus(HttpStatus.OK)
    public TemplateResponse find(@AuthenticationPrincipal Member member, @PathVariable Long templateId) {

        info("/api/templates/" + templateId, "GET", "");

        Template template = templateService.findById(templateId);
        return TemplateResponse.of(template, member);
    }

    @Operation(summary = "템플릿을 수정한다.")
    @PutMapping("/{templateId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void update(@AuthenticationPrincipal Member member, @PathVariable Long templateId,
        @RequestBody @Valid TemplateUpdateRequest request) {

        info("/api/templates/" + templateId, "PUT", "");

        templateService.update(member, templateId, request);
    }

    @Operation(summary = "템플릿을 삭제한다.")
    @DeleteMapping("/{templateId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@AuthenticationPrincipal Member member, @PathVariable Long templateId) {

        info("/api/templates/" + templateId, "DELETE", "");

        templateService.deleteById(member, templateId);
    }

    // deprecated

    @Operation(summary = "템플릿을 최신순으로 내림차순 정렬하여 모두 조회한다.")
    @Deprecated
    @GetMapping(params = "filter=latest")
    @ResponseStatus(HttpStatus.OK)
    public TemplatesResponse findAllOrderByLatest(@AuthenticationPrincipal Member member) {

        info("/api/templates?filter=latest", "GET", "");

        List<Template> templates = templateService.findAllOrderByLatest();
        return TemplatesResponse.of(templates, member);
    }

    @Operation(summary = "템플릿을 사용 횟수를 기준으로 내림차순 정렬하여 모두 조회한다.")
    @Deprecated
    @GetMapping(params = "filter=trend")
    @ResponseStatus(HttpStatus.OK)
    public TemplatesResponse findAllOrderByTrend(@AuthenticationPrincipal Member member) {

        info("/api/templates?filter=trend", "GET", "");

        List<Template> templates = templateService.findAllOrderByTrend();
        return TemplatesResponse.of(templates, member);
    }

    @Operation(summary = "사용자가 생성한 템플릿을 모두 조회한다.")
    @Deprecated
    @GetMapping(params = "member")
    @ResponseStatus(HttpStatus.OK)
    public MemberTemplatesResponse findByMemberId(@AuthenticationPrincipal Member member,
        @RequestParam(value = "member") String socialId) {

        info("/api/templates?member=" + socialId, "GET", "");

        List<Template> templates = templateService.findBySocialId(socialId);

        return MemberTemplatesResponse.of(templates, socialId, member);
    }

}
