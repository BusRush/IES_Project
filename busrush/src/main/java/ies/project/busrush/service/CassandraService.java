package ies.project.busrush.service;
import com.datastax.oss.driver.api.core.CqlSession;
import com.datastax.oss.driver.api.core.cql.ResultSet;
import com.datastax.driver.core.Cluster;
import com.datastax.driver.core.Session;

public class CassandraService {

    private final Session session;

    public CassandraService() {
        // Connect to the Cassandra cluster using the Cassandra Java driver
        Cluster cluster = Cluster.builder().addContactPoint("localhost").withPort(9042).build();
        this.session = cluster.connect();

        // Connect to the keyspace "busrush" in Cassandra
        session.execute("USE busrush");

    }

    public void createTable() {
          // Create the "bus_metrics" table in Cassandra
          session.execute("CREATE TABLE IF NOT EXISTS bus_metrics (bus_id text, timestamp text, route_id text, route_shift text, device_id text, position list<text>, speed double, fuel double, passengers int, PRIMARY KEY ((bus_id), timestamp)");
    }

    public void insertMetrics(String bus_id, Long timestamp, String route_id, String route_shift, String device_id, String[] position, Double speed, Double fuel, int passengers) {
        // Insert the given message into the "messages" table in Cassandra
        String cql = "INSERT INTO bus_metrics (bus_id, timestamp, route_id, route_shift, device_id, position, speed, fuel, passengers) VALUES ('" + bus_id + "', '" + timestamp + "','" + route_id + "','" + route_shift +"', '" + device_id + "', [" + position[0] + "," + position[1] + "] , " + speed + ", " + fuel + ", " + passengers + ")";
        session.execute(cql);
    }

}
