package com.reviewduck.config.datasource;

import java.util.Arrays;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

public class DataSourceSelector {

    private final List<String> dataSources;
    private final AtomicInteger counter = new AtomicInteger();

    public DataSourceSelector(String... dataSources) {
        this.dataSources = Arrays.stream(dataSources)
            .collect(Collectors.toUnmodifiableList());
    }

    public String getOne() {
        if (counter.get() >= dataSources.size()) {
            counter.set(0);
        }
        return dataSources.get(counter.getAndIncrement());
    }
}
