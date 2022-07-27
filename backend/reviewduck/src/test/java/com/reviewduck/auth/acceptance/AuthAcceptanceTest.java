package com.reviewduck.auth.acceptance;

import static org.hamcrest.Matchers.*;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;

import com.reviewduck.acceptance.AcceptanceTest;
import com.reviewduck.auth.dto.request.LoginRequest;

public class AuthAcceptanceTest extends AcceptanceTest {

    @Test
    @DisplayName("로그인에 실패한다.")
    void failToLogin() {
        LoginRequest request = new LoginRequest("aaasffjnajasnlk");

        post("/api/login", request)
            .statusCode(HttpStatus.UNAUTHORIZED.value());
    }

    // @Test
    // @DisplayName("로그인에 성공하면 토큰을 받아온다.")
    // void loginAndGetToken() {
    //     LoginRequest request = new LoginRequest("5bd386bf9eb516c302cb");
    //
    //     post("/api/login", request)
    //         .statusCode(HttpStatus.OK.value())
    //         .assertThat()
    //         .body("accessToken", notNullValue());
    // }
}
