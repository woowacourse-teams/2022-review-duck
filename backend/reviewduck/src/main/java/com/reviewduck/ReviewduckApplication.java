package com.reviewduck;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
// @EnableCaching
public class ReviewduckApplication {

    public static void main(String[] args) {
        SpringApplication.run(ReviewduckApplication.class, args);
    }

}
