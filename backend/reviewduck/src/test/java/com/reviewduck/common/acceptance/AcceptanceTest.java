package com.reviewduck.common.acceptance;

import java.util.Objects;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.cache.CacheManager;
import org.springframework.http.MediaType;
import org.springframework.test.context.jdbc.Sql;

import com.reviewduck.auth.support.JwtTokenProvider;
import com.reviewduck.member.domain.Member;
import com.reviewduck.member.service.MemberService;

import io.restassured.RestAssured;
import io.restassured.response.ValidatableResponse;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@Sql("classpath:truncate.sql")
public class AcceptanceTest {
    
    @Value("${local.server.port}")
    int port;

    @Autowired
    protected JwtTokenProvider jwtTokenProvider;

    @Autowired
    protected MemberService memberService;

    @Autowired
    protected CacheManager cacheManager;

    protected final long INVALID_REVIEW_ID = 99L;
    protected final String INVALID_CODE = "aaaaaaaa";
    protected final String INVALID_TOKEN = "tokentokentoken.invalidinvalidinvalid.tokentokentoken";

    protected String accessToken1;
    protected String accessToken2;
    protected Member savedMember;
    protected Member savedMember2;

    @BeforeEach
    public void setUp() {
        RestAssured.port = port;
        createMemberAndGetAccessToken();
    }

    @AfterEach
    public void clearCaches() {
        for (String cacheName : cacheManager.getCacheNames()) {
            Objects.requireNonNull(cacheManager.getCache(cacheName)).clear();
        }
    }

    private void createMemberAndGetAccessToken() {
        Member member1 = new Member("1", "panda", "제이슨", "profileUrl1");
        savedMember = memberService.save(member1);

        Member member2 = new Member("2", "ariari", "브리", "profileUrl2");
        savedMember2 = memberService.save(member2);

        accessToken1 = jwtTokenProvider.createAccessToken(String.valueOf(savedMember.getId()));
        accessToken2 = jwtTokenProvider.createAccessToken(String.valueOf(savedMember2.getId()));
    }

    public ValidatableResponse post(String url, Object request) {
        return RestAssured.given().log().all()
            .contentType(MediaType.APPLICATION_JSON_VALUE)
            .body(request)
            .when().post(url)
            .then().log().all();
    }

    public ValidatableResponse post(String url, Object request, String accessToken) {
        return RestAssured.given().log().all()
            .contentType(MediaType.APPLICATION_JSON_VALUE)
            .auth().oauth2(accessToken)
            .body(request)
            .when().post(url)
            .then().log().all();
    }

    public ValidatableResponse post(String url, String accessToken) {
        return RestAssured.given().log().all()
            .contentType(MediaType.APPLICATION_JSON_VALUE)
            .auth().oauth2(accessToken)
            .when().post(url)
            .then().log().all();
    }

    public ValidatableResponse post(String url) {
        return RestAssured.given().log().all()
            .contentType(MediaType.APPLICATION_JSON_VALUE)
            .when().post(url)
            .then().log().all();
    }

    public ValidatableResponse get(String url) {
        return RestAssured.given().log().all()
            .contentType(MediaType.APPLICATION_JSON_VALUE)
            .when().get(url)
            .then().log().all();
    }

    public ValidatableResponse get(String url, String accessToken) {
        return RestAssured.given().log().all()
            .contentType(MediaType.APPLICATION_JSON_VALUE)
            .auth().oauth2(accessToken)
            .when().get(url)
            .then().log().all();
    }

    public ValidatableResponse put(String url, Object request) {
        return RestAssured.given().log().all()
            .contentType(MediaType.APPLICATION_JSON_VALUE)
            .body(request)
            .when().put(url)
            .then().log().all();
    }

    public ValidatableResponse put(String url, Object request, String accessToken) {
        return RestAssured.given().log().all()
            .contentType(MediaType.APPLICATION_JSON_VALUE)
            .auth().oauth2(accessToken)
            .body(request)
            .when().put(url)
            .then().log().all();
    }

    public ValidatableResponse delete(String url) {
        return RestAssured.given().log().all()
            .contentType(MediaType.APPLICATION_JSON_VALUE)
            .when().delete(url)
            .then().log().all();
    }

    public ValidatableResponse delete(String url, String accessToken) {
        return RestAssured.given().log().all()
            .contentType(MediaType.APPLICATION_JSON_VALUE)
            .auth().oauth2(accessToken)
            .when().delete(url)
            .then().log().all();
    }
}
