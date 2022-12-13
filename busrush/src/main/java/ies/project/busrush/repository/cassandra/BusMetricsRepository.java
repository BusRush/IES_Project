package ies.project.busrush.repository.cassandra;

import ies.project.busrush.model.cassandra.BusMetrics;
import org.springframework.stereotype.Repository;
import org.springframework.data.cassandra.repository.CassandraRepository;
import org.springframework.data.keyvalue.annotation.KeySpace;

@Repository
@KeySpace("busrushdelays")
public interface BusMetricsRepository extends CassandraRepository<BusMetrics, String> {

}

