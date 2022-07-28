package com.reviewduck.auth.service;

import java.util.Objects;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.reviewduck.auth.dto.request.GithubTokenRequest;
import com.reviewduck.auth.dto.request.LoginRequest;
import com.reviewduck.auth.dto.response.GithubMemberResponse;
import com.reviewduck.auth.dto.response.GithubTokenResponse;
import com.reviewduck.auth.exception.AuthorizationException;
import com.reviewduck.auth.support.JwtTokenProvider;
import com.reviewduck.member.domain.Member;
import com.reviewduck.member.service.MemberService;

@Service
@Transactional
public class AuthService {
    private final JwtTokenProvider jwtTokenProvider;
    private final ObjectMapper objectMapper;
    private final RestTemplate restTemplate;
    private final MemberService memberService;

    @Value("${security.oauth2.client-id}")
    private String clientId;

    @Value("${security.oauth2.client-secret}")
    private String cliendSecret;

    public AuthService(JwtTokenProvider jwtTokenProvider, ObjectMapper objectMapper,
        RestTemplate restTemplate, MemberService memberService) {
        this.jwtTokenProvider = jwtTokenProvider;
        this.objectMapper = objectMapper;
        this.restTemplate = restTemplate;
        this.memberService = memberService;
    }

    public String createToken(final LoginRequest loginRequest) {
        Member member = getMemberFromGithub(loginRequest.getCode());
        Member loginMember = login(member);

        return jwtTokenProvider.createAccessToken(String.valueOf(loginMember.getId()));
    }

    private Member login(Member member) {
        if (memberService.existMember(member.getSocialId())) {
            return memberService.findBySocialId(member.getSocialId());
        }
        return memberService.save(member);
    }

    private Member getMemberFromGithub(String code) {
        String githubAccessToken = getGithubAccessToken(code);
        GithubMemberResponse githubMemberResponse = getGithubMemberResponse(githubAccessToken);
        return githubMemberResponse.toMember();

    }

    private String getGithubAccessToken(String code) {
        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE);
        headers.add(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE);
        GithubTokenRequest accessTokenRequest = new GithubTokenRequest(clientId, cliendSecret, code);

        HttpEntity<GithubTokenRequest> httpEntity = new HttpEntity<>(accessTokenRequest, headers);
        GithubTokenResponse githubTokenResponse = restTemplate.exchange(
            "https://github.com/login/oauth/access_token",
            HttpMethod.POST,
            httpEntity,
            GithubTokenResponse.class
        ).getBody();

        Objects.requireNonNull(githubTokenResponse);
        validateTokenResponse(githubTokenResponse);
        return githubTokenResponse.getAccessToken();
    }

    private void validateTokenResponse(GithubTokenResponse githubTokenResponse) {
        if (Objects.isNull(githubTokenResponse.getAccessToken())) {
            throw new AuthorizationException("깃허브 로그인이 실패했습니다.");
        }
    }

    private GithubMemberResponse getGithubMemberResponse(String githubAccessToken) {
        String token = "token " + githubAccessToken;

        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.add(HttpHeaders.AUTHORIZATION, token);
        httpHeaders.add(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE);
        HttpEntity<Void> httpEntity = new HttpEntity<>(httpHeaders);

        GithubMemberResponse githubMemberResponse = restTemplate.exchange(
            "https://api.github.com/user",
            HttpMethod.GET,
            httpEntity,
            GithubMemberResponse.class,
            objectMapper
        ).getBody();

        if (Objects.isNull(githubMemberResponse)) {
            throw new AuthorizationException("깃허브 유저 정보 가져오기가 실패했습니다.");
        }
        return githubMemberResponse;
    }

    public void validateToken(String token) {
        if (Objects.isNull(token)) {
            throw new AuthorizationException("토큰이 없습니다.");
        }

        if (jwtTokenProvider.isInvalidToken(token)) {
            throw new AuthorizationException("인증되지 않은 사용자입니다.");
        }
    }

    public String getPayload(String token) {
        return jwtTokenProvider.getPayload(token);
    }
}
