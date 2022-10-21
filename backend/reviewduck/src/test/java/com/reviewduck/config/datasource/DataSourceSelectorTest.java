package com.reviewduck.config.datasource;

import static org.assertj.core.api.Assertions.*;
import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

class DataSourceSelectorTest {

    @Test
    @DisplayName("순서에 맞게 값이 나오는지 검증한다.")
    void getOne(){
        //given
        String firstValue = "first";
        String secondValue = "second";
        DataSourceSelector dataSourceSelector = new DataSourceSelector(firstValue, secondValue);

        //when, then
        assertAll(
            () -> assertThat(dataSourceSelector.getOne()).isEqualTo(firstValue),
            () -> assertThat(dataSourceSelector.getOne()).isEqualTo(secondValue),
            () -> assertThat(dataSourceSelector.getOne()).isEqualTo(firstValue)
        );
    }
}
