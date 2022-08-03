package com.reviewduck.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    public static final String ALLOWED_METHOD_NAMES = "GET,HEAD,POST,PUT,DELETE,TRACE,OPTIONS,PATCH";

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
            .allowCredentials(true)
            .allowedOrigins("http://localhost:3000", "https://develop.ducks.kr", "https://ducks.kr")
            .allowedMethods(ALLOWED_METHOD_NAMES.split(","))
            .exposedHeaders(HttpHeaders.LOCATION);
    }

    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}
