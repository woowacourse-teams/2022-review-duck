package com.reviewduck.config.datasource;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

public class DataSourceSelector {

    private final List<String> dataSources;
    private int counter = 0;

    public DataSourceSelector(String... dataSources) {
        this.dataSources = Arrays.stream(dataSources)
            .collect(Collectors.toUnmodifiableList());
    }

    public String getOne() {
        if (counter == dataSources.size()) {
            counter = 0;
        }
        return dataSources.get(counter++);
    }
}
