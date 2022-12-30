package ies.project.busrush.repository.cassandra;

import ies.project.busrush.model.cassandra.BusMetrics;
import org.springframework.data.cassandra.repository.CassandraRepository;
import org.springframework.data.cassandra.repository.Query;

import java.util.*; 

public interface BusMetricsRepository extends CassandraRepository<BusMetrics, String> {
    @Query("SELECT position FROM bus_metrics WHERE bus_id = ?0 AND route_id = ?1 AND route_shift = ?2")
    List<Double> findpositionByBusIdandRouteIdandRouteShift(String bus_id, String route_id, String route_shift);
    @Query("SELECT passengers FROM bus_metrics WHERE bus_id = ?0")
    Integer findPassengersByBusId(String bus_id);
}
