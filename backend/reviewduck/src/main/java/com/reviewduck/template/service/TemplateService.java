package com.reviewduck.template.service;

import static com.reviewduck.template.dto.service.ServiceDtoConverter.*;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.reviewduck.auth.exception.AuthorizationException;
import com.reviewduck.common.exception.NotFoundException;
import com.reviewduck.member.domain.Member;
import com.reviewduck.member.repository.MemberRepository;
import com.reviewduck.review.domain.ReviewForm;
import com.reviewduck.review.dto.controller.request.ReviewFormCreateRequest;
import com.reviewduck.review.dto.controller.response.ReviewFormCodeResponse;
import com.reviewduck.review.dto.service.ReviewFormQuestionCreateDto;
import com.reviewduck.review.dto.service.ServiceDtoConverter;
import com.reviewduck.review.repository.ReviewFormRepository;
import com.reviewduck.template.domain.Template;
import com.reviewduck.template.dto.controller.request.TemplateCreateRequest;
import com.reviewduck.template.dto.controller.request.TemplateUpdateRequest;
import com.reviewduck.template.dto.controller.response.MemberTemplatesResponse;
import com.reviewduck.template.dto.controller.response.TemplateIdResponse;
import com.reviewduck.template.dto.controller.response.TemplateResponse;
import com.reviewduck.template.dto.controller.response.TemplatesResponse;
import com.reviewduck.template.repository.TemplateRepository;
import com.reviewduck.template.vo.TemplateSortType;

import lombok.AllArgsConstructor;

@Service
@Transactional(readOnly = true)
@AllArgsConstructor
public class TemplateService {

    private final TemplateRepository templateRepository;
    private final ReviewFormRepository reviewFormRepository;
    private final MemberRepository memberRepository;

    @Transactional
    @CacheEvict(value = "templatesCacheStore", allEntries = true)
    public TemplateIdResponse save(long memberId, TemplateCreateRequest request) {
        Member member = getMemberByMemberId(memberId);
        Template template = new Template(
            member,
            request.getTemplateTitle(),
            request.getTemplateDescription(),
            toTemplateQuestionCreateDtos(request.getQuestions())
        );
        return TemplateIdResponse.from(templateRepository.save(template));
    }

    @Transactional
    public ReviewFormCodeResponse createReviewFormByTemplate(long memberId, long templateId,
        ReviewFormCreateRequest request) {
        templateRepository.increaseUsedCount(templateId);
        return ReviewFormCodeResponse.from(saveFromTemplate(memberId, request));
    }

    @Transactional
    public ReviewFormCodeResponse createReviewFormByTemplate(long memberId, long templateId) {
        return ReviewFormCodeResponse.from(saveFromTemplate(memberId, templateId));
    }


    @Cacheable(value = "templateCacheStore", key = "#templateId")
    public TemplateResponse find(long templateId, long memberId) {
        Template template = findById(templateId);
        return TemplateResponse.of(template, memberId);
    }

    @Cacheable(value = "templatesCacheStore", key = "#page + #size + #sort")
    public TemplatesResponse findAll(int page, int size, String sort, long memberId) {
        String sortType = TemplateSortType.getSortBy(sort);
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, sortType));
        Page<Template> templates = templateRepository.findAll(pageRequest);
        return TemplatesResponse.of(templates, memberId);
    }

    @Cacheable(value = "templatesCacheStore", key = "#query + #page + #size")
    public TemplatesResponse search(String query, int page, int size, long memberId) {
        PageRequest pageRequest = PageRequest.of(page, size);
        Page<Template> templates = templateRepository.findByTemplateTitleContaining(pageRequest, query);
        return TemplatesResponse.of(templates, memberId);
    }

    public MemberTemplatesResponse findAllBySocialId(String socialId, int page, int size, long memberId) {
        Member member = getMemberBySocialId(socialId);
        boolean isMine = member.isSameId(memberId);

        Page<Template> templates = findAllByMember(page, size, member);
        return MemberTemplatesResponse.of(templates, isMine);
    }

    public Page<Template> findAllByMember(int page, int size, Member member) {
        Sort sort = Sort.by(Sort.Direction.DESC, TemplateSortType.LATEST.getSortBy());
        PageRequest pageRequest = PageRequest.of(page, size, sort);

        return templateRepository.findByMember(pageRequest, member);
    }

    @Transactional
    @Caching(evict = {
        @CacheEvict(value = "templateCacheStore", key = "#templateId"),
        @CacheEvict(value = "templatesCacheStore", allEntries = true)
    })
    public void update(long memberId, long templateId, TemplateUpdateRequest request) {
        Template template = findById(templateId);
        validateTemplateIsMine(template, memberId, "본인이 생성한 템플릿이 아니면 수정할 수 없습니다.");

        template.update(
            request.getTemplateTitle(),
            request.getTemplateDescription(),
            toTemplateQuestionUpdateDtos(request.getQuestions())
        );
    }

    @Transactional
    @Caching(evict = {
        @CacheEvict(value = "templateCacheStore", key = "#templateId"),
        @CacheEvict(value = "templatesCacheStore", allEntries = true)
    })
    public void delete(long memberId, long templateId) {
        Template template = findById(templateId);
        validateTemplateIsMine(template, memberId, "본인이 생성한 템플릿이 아니면 삭제할 수 없습니다.");

        templateRepository.delete(template);
    }

    private ReviewForm saveFromTemplate(long memberId, ReviewFormCreateRequest request) {
        Member member = getMemberByMemberId(memberId);
        List<ReviewFormQuestionCreateDto> questions = ServiceDtoConverter.toReviewFormQuestionCreateDtos(
            request.getQuestions());
        ReviewForm reviewForm = new ReviewForm(member, request.getReviewFormTitle(), questions);
        return reviewFormRepository.save(reviewForm);
    }

    private void validateTemplateIsMine(Template template, long memberId, String message) {
        if (!template.isMine(memberId)) {
            throw new AuthorizationException(message);
        }
    }

    private ReviewForm saveFromTemplate(long memberId, long templateId) {
        Template template = findById(templateId);
        templateRepository.increaseUsedCount(templateId);

        List<ReviewFormQuestionCreateDto> questions = template.getQuestions().stream()
            .map(question -> new ReviewFormQuestionCreateDto(question.getValue(), question.getDescription()))
            .collect(Collectors.toUnmodifiableList());
        Member member = getMemberByMemberId(memberId);
        ReviewForm reviewForm = new ReviewForm(member, template.getTemplateTitle(), questions);
        return reviewFormRepository.save(reviewForm);
    }

    private Template findById(long id) {
        return templateRepository.findById(id)
            .orElseThrow(() -> new NotFoundException("존재하지 않는 템플릿입니다."));
    }

    private Member getMemberByMemberId(Long memberId) {
        return memberRepository.findById(memberId)
            .orElseThrow(() -> new NotFoundException("존재하지 않는 사용자입니다."));
    }

    private Member getMemberBySocialId(String socialId) {
        return memberRepository.findBySocialId(socialId)
            .orElseThrow(() -> new NotFoundException("존재하지 않는 사용자입니다."));
    }
}
