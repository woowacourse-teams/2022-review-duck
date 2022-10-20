package com.reviewduck.template.service;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.transaction.annotation.Transactional;

import com.reviewduck.common.annotation.Aggregator;
import com.reviewduck.member.domain.Member;
import com.reviewduck.member.service.MemberService;
import com.reviewduck.review.domain.ReviewForm;
import com.reviewduck.review.dto.controller.request.ReviewFormCreateRequest;
import com.reviewduck.review.dto.controller.response.ReviewFormCodeResponse;
import com.reviewduck.review.service.ReviewFormService;
import com.reviewduck.template.domain.Template;
import com.reviewduck.template.dto.controller.request.TemplateCreateRequest;
import com.reviewduck.template.dto.controller.request.TemplateUpdateRequest;
import com.reviewduck.template.dto.controller.response.MemberTemplatesResponse;
import com.reviewduck.template.dto.controller.response.TemplateIdResponse;
import com.reviewduck.template.dto.controller.response.TemplateResponse;
import com.reviewduck.template.dto.controller.response.TemplatesResponse;

import lombok.AllArgsConstructor;

@Aggregator
@AllArgsConstructor
public class TemplateAggregator {

    private final ReviewFormService reviewFormService;
    private final TemplateService templateService;
    private final MemberService memberService;

    @Transactional
    public TemplateIdResponse save(long memberId, TemplateCreateRequest request) {
        Member member = memberService.findById(memberId);

        Template template = templateService.save(member, request);
        return TemplateIdResponse.from(template);
    }

    @Transactional
    public ReviewFormCodeResponse createReviewFormByTemplate(long memberId, long templateId,
        ReviewFormCreateRequest request) {
        ReviewForm reviewForm = reviewFormService.saveFromTemplate(memberId, templateId, request);
        return ReviewFormCodeResponse.from(reviewForm);
    }

    @Transactional
    public ReviewFormCodeResponse createReviewFormByTemplate(long memberId, long templateId) {
        ReviewForm reviewForm = reviewFormService.saveFromTemplate(memberId, templateId);
        return ReviewFormCodeResponse.from(reviewForm);
    }

    @Cacheable(value = "templateCacheStore", key = "#templateId")
    public TemplateResponse find(long templateId, long memberId) {
        Template template = templateService.findById(templateId);
        return TemplateResponse.of(template, memberId);
    }

    @Cacheable(value = "templatesCacheStore", key = "#page + #size + #sort")
    public TemplatesResponse findAll(int page, int size, String sort, long memberId) {
        Page<Template> templates = templateService.findAll(page, size, sort);
        return TemplatesResponse.of(templates, memberId);
    }

    @Cacheable(value = "templatesCacheStore", key = "#query + #page + #size + #sort")
    public TemplatesResponse search(String query, int page, int size, String sort, long memberId) {
        Page<Template> templates = templateService.search(query, page - 1, size, sort);
        return TemplatesResponse.of(templates, memberId);
    }

    public MemberTemplatesResponse findAllBySocialId(String socialId, int page, int size, long memberId) {
        Member member = memberService.findBySocialId(socialId);
        boolean isMine = member.isSameId(memberId);

        Page<Template> templates = templateService.findAllByMember(page, size, member);
        return MemberTemplatesResponse.of(templates, isMine);
    }

    @Transactional
    @CachePut(value = "templateCacheStore", key = "#templateId")
    public void update(long memberId, long templateId, TemplateUpdateRequest request) {
        templateService.update(memberId, templateId, request);
    }

    @Transactional
    @CacheEvict(value = "templateCacheStore", key = "#templateId")
    public void delete(long memberId, long templateId) {
        templateService.deleteById(memberId, templateId);
    }
}
