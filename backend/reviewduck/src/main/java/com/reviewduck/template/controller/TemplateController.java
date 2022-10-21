package com.reviewduck.template.controller;

import static com.reviewduck.common.util.Logging.*;
import static com.reviewduck.common.vo.PageConstant.*;

import javax.validation.Valid;
import javax.validation.constraints.NotBlank;

import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
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
import com.reviewduck.member.dto.MemberDto;
import com.reviewduck.review.dto.controller.request.ReviewFormCreateRequest;
import com.reviewduck.review.dto.controller.response.ReviewFormCodeResponse;
import com.reviewduck.template.dto.controller.request.TemplateCreateRequest;
import com.reviewduck.template.dto.controller.request.TemplateUpdateRequest;
import com.reviewduck.template.dto.controller.response.MemberTemplatesResponse;
import com.reviewduck.template.dto.controller.response.TemplateIdResponse;
import com.reviewduck.template.dto.controller.response.TemplateResponse;
import com.reviewduck.template.dto.controller.response.TemplatesResponse;
import com.reviewduck.template.service.TemplateAggregator;

import io.swagger.v3.oas.annotations.Operation;
import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/api/templates")
@AllArgsConstructor
@Validated
public class TemplateController {

    private final TemplateAggregator aggregator;

    @Operation(summary = "템플릿을 생성한다.")
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TemplateIdResponse create(@AuthenticationPrincipal MemberDto member,
        @RequestBody @Valid TemplateCreateRequest request) {

        info("/api/templates", "POST", request.toString());

        return aggregator.save(member.getId(), request);
    }

    @Operation(summary = "템플릿을 기반으로 작성된 후 수정된 회고 폼을 생성한다.")
    @PostMapping("/{templateId}/review-forms/edited")
    @ResponseStatus(HttpStatus.CREATED)
    public ReviewFormCodeResponse createReviewFormByTemplate(@AuthenticationPrincipal MemberDto member,
        @PathVariable long templateId,
        @RequestBody @Valid ReviewFormCreateRequest request) {

        info("/api/templates/" + templateId + "/review-forms/edited", "POST", request.toString());

        return aggregator.createReviewFormByTemplate(member.getId(), templateId, request);
    }

    @Operation(summary = "템플릿을 기반으로 회고 폼을 생성한다.")
    @PostMapping("/{templateId}/review-forms")
    @ResponseStatus(HttpStatus.CREATED)
    public ReviewFormCodeResponse createReviewFormByTemplate(@AuthenticationPrincipal MemberDto member,
        @PathVariable long templateId) {

        info("/api/templates/" + templateId + "/review-forms", "POST", "");

        return aggregator.createReviewFormByTemplate(member.getId(), templateId);
    }

    @Operation(summary = "전체 템플릿을 조회한다.")
    @GetMapping("/all")
    @ResponseStatus(HttpStatus.OK)
    public TemplatesResponse findAll(@AuthenticationPrincipal MemberDto member,
        @RequestParam(required = false, defaultValue = DEFAULT_PAGE) int page,
        @RequestParam(required = false, defaultValue = DEFAULT_SIZE) int size,
        @RequestParam(required = false, defaultValue = "trend") String sort) {

        info("/api/templates?page=" + page + " size=" + size, "GET", "");

        return aggregator.findAll(page - 1, size, sort, member.getId());
    }

    @Operation(summary = "사용자가 생성한 템플릿을 모두 조회한다.")
    @GetMapping(params = "member")
    @ResponseStatus(HttpStatus.OK)
    public MemberTemplatesResponse findAllBySocialId(@AuthenticationPrincipal MemberDto member,
        @NotBlank @RequestParam(value = "member") String socialId,
        @RequestParam(required = false, defaultValue = DEFAULT_PAGE) int page,
        @RequestParam(required = false, defaultValue = DEFAULT_SIZE) int size) {

        info("/api/templates?member=" + socialId + " page=" + page + " size=" + size, "GET", "");

        return aggregator.findAllBySocialId(socialId, page - 1, size, member.getId());
    }

    @Operation(summary = "템플릿 검색 결과를 조회한다.")
    @GetMapping(value = "/search")
    @ResponseStatus(HttpStatus.OK)
    public TemplatesResponse search(@AuthenticationPrincipal MemberDto member,
        @RequestParam String query,
        @RequestParam(required = false, defaultValue = DEFAULT_PAGE) int page,
        @RequestParam(required = false, defaultValue = DEFAULT_SIZE) int size) {

        info("/api/templates/search?query=" + query + " page=" + page + " size=" + size, "GET", "");

        return aggregator.search(query, page, size, member.getId());
    }

    @Operation(summary = "특정 템플릿을 조회한다.")
    @GetMapping("/{templateId}")
    @ResponseStatus(HttpStatus.OK)
    public TemplateResponse find(@AuthenticationPrincipal MemberDto member, @PathVariable long templateId) {

        info("/api/templates/" + templateId, "GET", "");

        return aggregator.find(templateId, member.getId());
    }

    @Operation(summary = "템플릿을 수정한다.")
    @PutMapping("/{templateId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void update(@AuthenticationPrincipal MemberDto member, @PathVariable long templateId,
        @RequestBody @Valid TemplateUpdateRequest request) {

        info("/api/templates/" + templateId, "PUT", "");

        aggregator.update(member.getId(), templateId, request);
    }

    @Operation(summary = "템플릿을 삭제한다.")
    @DeleteMapping("/{templateId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@AuthenticationPrincipal MemberDto member, @PathVariable long templateId) {

        info("/api/templates/" + templateId, "DELETE", "");

        aggregator.delete(member.getId(), templateId);
    }

}
