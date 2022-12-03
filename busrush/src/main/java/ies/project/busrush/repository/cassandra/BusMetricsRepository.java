package ies.project.busrush.repository.cassandra;

import ies.project.busrush.model.cassandra.BusMetrics;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;

@Repository
public interface BusMetricsRepository extends JpaRepository<BusMetrics, String> {

}

