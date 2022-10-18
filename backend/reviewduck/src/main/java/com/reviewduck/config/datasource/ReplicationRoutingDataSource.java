package com.reviewduck.config.datasource;

import static com.reviewduck.config.datasource.DataSourceConfiguration.*;

import org.springframework.jdbc.datasource.lookup.AbstractRoutingDataSource;
import org.springframework.transaction.support.TransactionSynchronizationManager;

public class ReplicationRoutingDataSource extends AbstractRoutingDataSource {

    private final DataSourceSelector dataSourceSelector = new DataSourceSelector(REPLICA, SOURCE);

    @Override
    protected Object determineCurrentLookupKey() {
        boolean isReadOnly = TransactionSynchronizationManager.isCurrentTransactionReadOnly();

        if (isReadOnly) {
            return dataSourceSelector.getOne();
        }
        return SOURCE;
    }
}
