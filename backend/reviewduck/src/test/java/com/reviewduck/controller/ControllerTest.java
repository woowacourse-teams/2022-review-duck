package com.reviewduck.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.reviewduck.auth.controller.AuthController;
import com.reviewduck.auth.service.AuthService;
import com.reviewduck.auth.support.JwtTokenProvider;
import com.reviewduck.member.controller.MemberController;
import com.reviewduck.member.service.MemberService;
import com.reviewduck.review.controller.ReviewController;
import com.reviewduck.review.controller.ReviewFormController;
import com.reviewduck.review.service.ReviewFormService;
import com.reviewduck.review.service.ReviewService;
import com.reviewduck.template.controller.TemplateController;
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

    protected final String ACCESS_TOKEN = "access_token";
    protected final Long INVALID_REVIEW_ID = 1L;
    protected final String INVALID_CODE = "aaaaaaaa";
}
