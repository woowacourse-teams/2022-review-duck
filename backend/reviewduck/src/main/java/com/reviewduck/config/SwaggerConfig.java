package com.reviewduck.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import springfox.documentation.builders.ApiInfoBuilder;
import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;

@Configuration
public class SwaggerConfig {
    private static final String API_NAME = "회고덕 API";
    private static final String API_VERSION = "0.0.1";
    private static final String API_DESCRIPTION = "회고를 회고하는 회고덕 서비스를 위한 API";

    @Bean
    public Docket api() {
        return new Docket(DocumentationType.OAS_30)
            .apiInfo(apiInfo())
            .select()
            .apis(RequestHandlerSelectors.any())
            .paths(PathSelectors.any())
            .build();
    }

    private ApiInfo apiInfo() {
        ApiInfoBuilder apiInfoBuilder = new ApiInfoBuilder()
            .title(API_NAME)
            .version(API_VERSION)
            .description(API_DESCRIPTION);

        return apiInfoBuilder.build();
    }

}
