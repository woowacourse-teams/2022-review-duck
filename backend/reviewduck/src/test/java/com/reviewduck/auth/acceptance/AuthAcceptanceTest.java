package com.reviewduck.auth.acceptance;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;

import com.reviewduck.common.acceptance.AcceptanceTest;
import com.reviewduck.auth.dto.request.LoginRequest;

public class AuthAcceptanceTest extends AcceptanceTest {

    @Test
    @DisplayName("로그인에 실패한다.")
    void failToLogin() {
        LoginRequest request = new LoginRequest("aaasffjnajasnlk");

        post("/api/login", request)
            .statusCode(HttpStatus.UNAUTHORIZED.value());
    }
}
