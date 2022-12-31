package ies.project.busrush.repository.cassandra;

import ies.project.busrush.model.cassandra.BusMetrics;
import org.springframework.data.cassandra.repository.CassandraRepository;
import org.springframework.data.cassandra.repository.Query;

import java.util.*; 

public interface BusMetricsRepository extends CassandraRepository<BusMetrics, String> {
    @Query("SELECT position FROM bus_metrics WHERE bus_id = ?0 LIMIT 1;")
    List<Double> findPositionByBusId(String bus_id);
    @Query("SELECT passengers FROM bus_metrics WHERE bus_id = ?0 LIMIT 1;")
    Integer findPassengersByBusId(String bus_id);
}
