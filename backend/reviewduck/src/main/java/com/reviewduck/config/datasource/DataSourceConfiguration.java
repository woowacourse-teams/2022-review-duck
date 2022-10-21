package com.reviewduck.config.datasource;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.autoconfigure.flyway.FlywayDataSource;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.zaxxer.hikari.HikariDataSource;

@Configuration
public class DataSourceConfiguration {

    static final String SOURCE = "SOURCE";
    static final String REPLICA = "REPLICA";

    @Bean
    @FlywayDataSource
    @Qualifier(SOURCE)
    @ConfigurationProperties(prefix = "spring.datasource.source.hikari")
    public DataSource sourceDataSource() {
        return DataSourceBuilder.create()
            .type(HikariDataSource.class)
            .build();
    }

    @Bean
    @Qualifier(REPLICA)
    @ConfigurationProperties(prefix = "spring.datasource.replica.hikari")
    public DataSource replicaDataSource() {
        return DataSourceBuilder.create()
            .type(HikariDataSource.class)
            .build();
    }
}
