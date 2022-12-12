package ies.project.busrush.service;
import com.datastax.oss.driver.api.core.CqlSession;
import com.datastax.oss.driver.api.core.cql.ResultSet;
import com.datastax.driver.core.Cluster;
import com.datastax.driver.core.Session;

public class CassandraService {

    private final Session session;

    public CassandraService() {
        // Connect to the Cassandra cluster using the Cassandra Java driver
        Cluster cluster = Cluster.builder().addContactPoint("localhost").build();
        this.session = cluster.connect();

        // Connect to the keyspace "busrush" in Cassandra
        session.execute("USE busrush");
    }

    public void insertMetric(String message) {
        // Insert the given message into the "messages" table in Cassandra
        String cql = "INSERT INTO messages (message) VALUES (?)";
        session.execute(cql, message);
    }

}
