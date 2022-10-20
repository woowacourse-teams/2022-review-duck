package com.reviewduck.common.dto;

import com.github.benmanes.caffeine.cache.stats.CacheStats;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class CacheMetricsResponse {

    private long requestCount;
    private double hitRate;
    private long missCount;
    private long evictionCount;
    private double totalLoadTime;
    private double averageLoadPenalty;

    public static CacheMetricsResponse from(CacheStats stats) {
        return new CacheMetricsResponse(stats.requestCount(), stats.hitRate(), stats.missCount(), stats.evictionCount(),
            stats.totalLoadTime(), stats.averageLoadPenalty());
    }
}
