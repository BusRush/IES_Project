package ies.project.busrush.repository.cassandra;

import ies.project.busrush.model.cassandra.BusMetrics;
import org.springframework.stereotype.Repository;
import org.springframework.data.cassandra.repository.CassandraRepository;

@Repository
public interface BusMetricsRepository extends CassandraRepository<BusMetrics, String> {

}

