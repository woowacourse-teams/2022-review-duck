package com.reviewduck.review.vo;

import java.util.Arrays;

/**
 * ex) sort=latest
 * param: 요청으로 받는 sort query에 해당하는 query value
 * sortBy: OrderBy에 사용할 database column
 */
public enum ReviewSortType {

    LATEST("latest", "createdAt"),
    UPDATE("update", "updatedAt"),
    TREND("trend", "createdAt");

    private final String param;
    private final String sortBy;

    ReviewSortType(String param, String sortBy) {
        this.param = param;
        this.sortBy = sortBy;
    }

    public static String getSortBy(String input) {
        return Arrays.stream(values())
            .filter(it -> it.param.equals(input))
            .findAny()
            .orElse(UPDATE)
            .sortBy;
    }

    public static boolean isTrend(String param) {
        return TREND.param.equals(param);
    }

    public String getSortBy() {
        return sortBy;
    }
}
