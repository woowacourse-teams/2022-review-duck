package com.reviewduck.common.controller;

import java.util.Arrays;

import org.springframework.core.env.Environment;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;

@RestController
@AllArgsConstructor
public class WebRestController {
    private final Environment env;

    @Operation(summary = "스프링 프로파일을 조회한다.")
    @GetMapping("/profile")
    public String getProfile(){
        return Arrays.stream(env.getActiveProfiles()).findFirst().orElse("");
    }

    @Operation(summary = "요청 처리 준비 여부를 조회한다.")
    @GetMapping("/healths")
    public String health() {
        return "UP";
    }
}
