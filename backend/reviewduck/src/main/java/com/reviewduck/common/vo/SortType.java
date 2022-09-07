package com.reviewduck.common.vo;

import java.util.Arrays;

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
