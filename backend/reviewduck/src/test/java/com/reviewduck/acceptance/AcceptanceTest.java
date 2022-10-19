package com.reviewduck.acceptance;

import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.jdbc.Sql;

import com.reviewduck.auth.support.JwtTokenProvider;
import com.reviewduck.member.domain.Member;
import com.reviewduck.member.dto.response.MemberDto;
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

    protected final Long INVALID_REVIEW_ID = 99L;
    protected final String INVALID_CODE = "aaaaaaaa";
    protected final String INVALID_TOKEN = "tokentokentoken.invalidinvalidinvalid.tokentokentoken";

    protected String accessToken1;
    protected String accessToken2;
    protected MemberDto savedMember;

    @BeforeEach
    public void setUp() {
        RestAssured.port = port;
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
