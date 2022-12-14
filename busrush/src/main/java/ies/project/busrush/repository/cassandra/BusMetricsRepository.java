package ies.project.busrush.repository.cassandra;

import ies.project.busrush.model.cassandra.BusMetrics;

import com.datastax.oss.driver.api.core.cql.SimpleStatement;
import com.datastax.oss.driver.api.core.CqlIdentifier;
import com.datastax.oss.driver.api.core.CqlSession;
import com.datastax.oss.driver.api.core.cql.ResultSet;
import com.datastax.oss.driver.api.core.type.DataTypes;
import com.datastax.oss.driver.api.querybuilder.SchemaBuilder;
import com.datastax.oss.driver.api.querybuilder.schema.CreateTable;

public class BusMetricsRepository {
    private static final String TABLE_NAME = "bus_metrics";
    private final CqlSession session;

    public BusMetricsRepository(CqlSession session) {
        this.session = session;
    }

    public void createTable(String keyspace) {
        CreateTable createTable = SchemaBuilder.createTable(TABLE_NAME)
            .withPartitionKey("bus_id", DataTypes.TEXT)
            .withClusteringColumn("timestamp", DataTypes.BIGINT)
            .withColumn("route_id", DataTypes.TEXT)
            .withColumn("route_shift", DataTypes.TEXT)
            .withColumn("device_id", DataTypes.TEXT)
            .withColumn("position", DataTypes.listOf(DataTypes.TEXT))
            .withColumn("speed", DataTypes.DOUBLE)
            .withColumn("fuel", DataTypes.DOUBLE)
            .withColumn("passengers", DataTypes.INT);
            

        executeStatement(createTable.build(), keyspace);
    }

    private ResultSet executeStatement(SimpleStatement statement, String keyspace) {
        if (keyspace != null) {
            statement.setKeyspace(CqlIdentifier.fromCql(keyspace));
        }

        return session.execute(statement);
    }

    // Insert metric into bus metrics 
    public void insertMetric(BusMetrics metric, String keyspace) {
        SimpleStatement statement = SimpleStatement.builder("INSERT INTO bus_metrics (bus_id, timestamp, route_id, route_shift, device_id, position, speed, fuel, passengers) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)")
            .addPositionalValues(metric.getBus_id(), metric.getTimestamp(), metric.getRoute_id(), metric.getRoute_shift(), metric.getDevice_id(), metric.getPosition(), metric.getSpeed(), metric.getFuel(), metric.getPassengers())
            .build();

        executeStatement(statement, keyspace);
    }
}

