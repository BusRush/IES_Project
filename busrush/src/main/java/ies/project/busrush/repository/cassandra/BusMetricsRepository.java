package ies.project.busrush.repository.cassandra;

import ies.project.busrush.model.cassandra.BusMetrics;
import org.springframework.data.cassandra.repository.CassandraRepository;

public interface BusMetricsRepository extends CassandraRepository<BusMetrics, String> {
}
