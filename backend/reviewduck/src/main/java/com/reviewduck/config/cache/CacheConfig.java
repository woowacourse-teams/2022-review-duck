package com.reviewduck.config.cache;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.cache.CacheManager;
import org.springframework.cache.caffeine.CaffeineCache;
import org.springframework.cache.support.SimpleCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CacheConfig {

    @Bean
    public CacheManager cacheManager() {

        List<CaffeineCache> caches = Arrays.stream(CacheType.values())
            .map(CacheType::buildCache)
            .collect(Collectors.toUnmodifiableList());

        SimpleCacheManager cacheManager = new SimpleCacheManager();
        cacheManager.setCaches(caches);

        return cacheManager;
    }
}
