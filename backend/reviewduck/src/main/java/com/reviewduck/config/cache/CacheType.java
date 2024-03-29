package com.reviewduck.config.cache;

import java.util.concurrent.TimeUnit;

import org.springframework.cache.caffeine.CaffeineCache;

import com.github.benmanes.caffeine.cache.Caffeine;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public enum CacheType {

    MemberCache("memberCacheStore", 10 * 60, 150),
    TemplateCache("templateCacheStore", 10 * 60, 300),
    TemplatesCache("templatesCacheStore", 60, 100);

    private final String cacheName;
    private final long duration;
    private final long maxSize;

    public CaffeineCache buildCache() {
        return new CaffeineCache(cacheName, Caffeine.newBuilder()
            .recordStats()
            .expireAfterWrite(duration, TimeUnit.SECONDS)
            .maximumSize(maxSize)
            .build());
    }
}
