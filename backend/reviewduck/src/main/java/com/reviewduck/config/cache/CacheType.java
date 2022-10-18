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

    MemberCache("memberCacheStore", 10 * 60, 100),
    TemplateCache("templateCacheStore", 60, 300);

    private final String cacheName;
    private final long duration;
    private final long maxSize;

    public CaffeineCache buildCache() {
        return new CaffeineCache(cacheName, Caffeine.newBuilder()
            .recordStats()
            .refreshAfterWrite(duration, TimeUnit.SECONDS)
            .maximumSize(maxSize)
            .build());
    }
}
