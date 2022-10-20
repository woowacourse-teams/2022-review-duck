package com.reviewduck.common.controller;

import org.springframework.cache.CacheManager;
import org.springframework.cache.caffeine.CaffeineCache;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.github.benmanes.caffeine.cache.stats.CacheStats;
import com.reviewduck.common.dto.CacheMetricsResponse;

import io.swagger.v3.oas.annotations.Operation;
import lombok.AllArgsConstructor;

@RestController
@AllArgsConstructor
public class CacheController {

    private final CacheManager cacheManager;

    @Operation(summary = "Member Cache Metric을 조회한다.")
    @GetMapping("/metrics/cache/member")
    public CacheMetricsResponse getMemberCacheMetrics() {
        CacheStats stats = ((CaffeineCache)cacheManager.getCache("memberCacheStore")).getNativeCache().stats();
        return CacheMetricsResponse.from(stats);
    }

    @Operation(summary = "Template Cache Metric을 조회한다.")
    @GetMapping("/metrics/cache/template")
    public CacheMetricsResponse getTemplateCacheMetrics() {
        CacheStats stats = ((CaffeineCache)cacheManager.getCache("templateCacheStore")).getNativeCache().stats();
        return CacheMetricsResponse.from(stats);
    }

    @Operation(summary = "Template list Cache Metric을 조회한다.")
    @GetMapping("/metrics/cache/templates")
    public CacheMetricsResponse getTemplatesCacheMetrics() {
        CacheStats stats = ((CaffeineCache)cacheManager.getCache("templatesCacheStore")).getNativeCache().stats();
        return CacheMetricsResponse.from(stats);
    }
}
