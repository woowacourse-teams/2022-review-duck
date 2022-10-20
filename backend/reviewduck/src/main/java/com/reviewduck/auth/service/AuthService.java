package com.reviewduck.auth.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.reviewduck.auth.dto.request.GithubTokenRequest;
import com.reviewduck.auth.dto.request.LoginRequest;
import com.reviewduck.auth.dto.response.GithubMemberResponse;
import com.reviewduck.auth.dto.response.GithubTokenResponse;
import com.reviewduck.auth.dto.service.TokensDto;
import com.reviewduck.auth.exception.AuthorizationException;
import com.reviewduck.auth.support.JwtTokenProvider;
import com.reviewduck.member.domain.Member;
import com.reviewduck.member.repository.MemberRepository;
import com.reviewduck.member.service.MemberService;

@Service
@Transactional(readOnly = true)
public class AuthService {

    private final JwtTokenProvider jwtTokenProvider;
    private final ObjectMapper objectMapper;
    private final RestTemplate restTemplate;
    private final MemberRepository memberRepository;

    @Value("${security.oauth2.client-id}")
    private String clientId;

    @Value("${security.oauth2.client-secret}")
    private String clientSecret;

    public AuthService(JwtTokenProvider jwtTokenProvider, ObjectMapper objectMapper,
        RestTemplate restTemplate, MemberRepository memberRepository) {
        this.jwtTokenProvider = jwtTokenProvider;
        this.objectMapper = objectMapper;
        this.restTemplate = restTemplate;
        this.memberRepository = memberRepository;
    }

    @Transactional
    public TokensDto createTokens(LoginRequest loginRequest) {
        String githubAccessToken = getGithubAccessToken(loginRequest.getCode());
        GithubMemberResponse githubMemberResponse = getGithubMemberResponse(githubAccessToken);

        Member loginMember = login(githubMemberResponse);

        return generateTokens(loginMember.getId());
    }

    @Transactional
    public TokensDto regenerateTokens(String refreshToken) {
        jwtTokenProvider.validateRefreshToken(refreshToken);
        long memberId = Long.parseLong(jwtTokenProvider.getRefreshTokenPayload(refreshToken));
        Member member = memberRepository.findById(memberId)
            .orElseThrow(() -> new AuthorizationException("존재하지 않는 사용자입니다."));
        return generateTokens(member.getId());
    }

    private TokensDto generateTokens(long memberId) {
        String accessToken = jwtTokenProvider.createAccessToken(String.valueOf(memberId));
        String refreshToken = jwtTokenProvider.createRefreshToken(String.valueOf(memberId));

        return new TokensDto(accessToken, refreshToken);
    }

    private String getGithubAccessToken(String code) {
        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE);
        headers.add(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE);
        GithubTokenRequest accessTokenRequest = new GithubTokenRequest(clientId, clientSecret, code);

        HttpEntity<GithubTokenRequest> httpEntity = new HttpEntity<>(accessTokenRequest, headers);
        GithubTokenResponse githubTokenResponse = restTemplate.exchange(
            "https://github.com/login/oauth/access_token",
            HttpMethod.POST,
            httpEntity,
            GithubTokenResponse.class
        ).getBody();

        validateTokenResponse(githubTokenResponse);
        return githubTokenResponse.getAccessToken();
    }

    private void validateTokenResponse(GithubTokenResponse githubTokenResponse) {
        if (githubTokenResponse != null && githubTokenResponse.getAccessToken() == null) {
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

        validateMemberResponse(githubMemberResponse);
        return githubMemberResponse;
    }

    private void validateMemberResponse(GithubMemberResponse githubMemberResponse) {
        if (githubMemberResponse == null) {
            throw new AuthorizationException("깃허브 유저 정보 가져오기가 실패했습니다.");
        }
    }

    private Member login(GithubMemberResponse githubMemberResponse) {
        Optional<Member> member = memberRepository.findBySocialId(githubMemberResponse.getSocialId());
        if (member.isEmpty()) {
            return memberRepository.save(githubMemberResponse.toMember());
        }

        Member foundMember = member.get();
        foundMember.updateSocialInfo(githubMemberResponse.getSocialNickname(), githubMemberResponse.getAvatarUrl());
        return foundMember;
    }
}
