package com.reviewduck.common.vo;

import java.util.Arrays;

/**
 * ex) sort=latest
 * param: 요청으로 받는 sort query에 해당하는 query value
 * sortBy: OrderBy에 사용할 database column
 */
public enum SortType {

    LATEST("latest", "updatedAt"),
    TREND("trend", "usedCount");

    private final String param;
    private final String sortBy;

    SortType(String param, String sortBy) {
        this.param = param;
        this.sortBy = sortBy;
    }

    public static String getSortBy(String input) {
        return Arrays.stream(values())
            .filter(s -> s.param.equals(input))
            .findAny()
            .orElse(LATEST)
            .sortBy;
    }
}
