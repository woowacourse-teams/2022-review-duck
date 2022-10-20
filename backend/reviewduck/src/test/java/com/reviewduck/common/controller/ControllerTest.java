package com.reviewduck.common.controller;

import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.BDDMockito.*;

import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.reviewduck.auth.controller.AuthController;
import com.reviewduck.auth.service.AuthService;
import com.reviewduck.auth.support.JwtTokenProvider;
import com.reviewduck.member.controller.MemberController;
import com.reviewduck.member.domain.Member;
import com.reviewduck.member.service.MemberAggregator;
import com.reviewduck.member.service.MemberService;
import com.reviewduck.review.controller.ReviewController;
import com.reviewduck.review.controller.ReviewFormController;
import com.reviewduck.review.service.ReviewFormAggregator;
import com.reviewduck.review.service.ReviewFormService;
import com.reviewduck.review.service.ReviewAggregator;
import com.reviewduck.review.service.ReviewService;
import com.reviewduck.template.controller.TemplateController;
import com.reviewduck.template.service.TemplateAggregator;
import com.reviewduck.template.service.TemplateService;

@WebMvcTest({AuthController.class, MemberController.class, ReviewController.class,
    ReviewFormController.class, TemplateController.class})
public class ControllerTest {

    @Autowired
    protected MockMvc mockMvc;
    @Autowired
    protected ObjectMapper objectMapper;
    @MockBean
    protected JwtTokenProvider jwtTokenProvider;
    @MockBean
    protected AuthService authService;
    @MockBean
    protected MemberService memberService;
    @MockBean
    protected ReviewService reviewService;
    @MockBean
    protected ReviewFormService reviewFormService;
    @MockBean
    protected TemplateService TemplateService;
    @MockBean
    protected MemberAggregator memberAggregator;
    @MockBean
    protected TemplateAggregator templateAggregator;
    @MockBean
    protected ReviewFormAggregator reviewFormAggregator;
    @MockBean
    protected ReviewAggregator reviewAggregator;

    protected final String ACCESS_TOKEN = "access_token";
    protected final Long INVALID_REVIEW_ID = 1L;
    protected final String INVALID_CODE = "aaaaaaaa";

    @BeforeEach
    void createMemberAndGetAccessToken() {
        Optional<Member> member = Optional.of(new Member(1L, "1", "panda", "제이슨", "profileUrl"));
        given(jwtTokenProvider.getAccessTokenPayload(anyString())).willReturn("1");
        given(memberService.getById(anyLong())).willReturn(member);
    }
}
