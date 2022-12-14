package ies.project.busrush.service;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Service;

import com.datastax.oss.driver.api.core.CqlSession;
import com.datastax.oss.driver.api.core.cql.BoundStatement;
import com.datastax.oss.driver.api.core.cql.PreparedStatement;

import org.json.JSONObject;
import ies.project.busrush.repository.BusRepository;
import ies.project.busrush.repository.cassandra.BusMetricsRepository;


@Service
public class QueueService {

    private BusRepository busRepository;

    @Autowired
    public QueueService(BusRepository busRepository) {
        this.busRepository = busRepository;
    }

    @RabbitListener(queues = "devices")
    public void receive(@Payload String msg) {

        // Message received from RabbitMQ queue
        // msg : {'device_id': 'AVRBUS-D0001', 'route_id': 'AVRBUS-L04', 'route_shift': '083000', 'timestamp': 1670868915, 'position': [40.63554147, -8.65516931], 'speed': 15.156, 'fuel': 98.878, 'passengers': 15}

        CassandraConnector cassandra_connector = new CassandraConnector();
        cassandra_connector.connect("localhost", 9042, "busrushdelays", "busrush");
        CqlSession session = cassandra_connector.getSession();

        BusMetricsRepository busMetricsRepository = new BusMetricsRepository(session);
        busMetricsRepository.createTable("busrushdelays");        

        System.out.println("Received: " + msg); 
        System.out.println("NEW"); 
        
        JSONObject json = new JSONObject(msg);

        String device_id = json.getString("device_id");
        Long timestamp = Long.parseLong(json.getString("timestamp"));
        String route_id = json.getString("route_id");
        String route_shift = json.getString("route_shift");
        String pos = json.getString("position");
        String[] position = pos.replaceAll("\\[", "").split(",") ;
        Double speed = Double.parseDouble(json.getString("speed"));
        Double fuel = Double.parseDouble(json.getString("fuel"));
        int passengers = Integer.parseInt(json.getString("passengers"));

        System.out.println("AQUIII");

        // Get field bus_id from MySQL
        String bus_id = busRepository.findBusIdByDeviceId(device_id);

        System.out.println("BUS ID: " + bus_id);

        // Create an instance of BusMetrics with some values
        //BusMetrics busMetrics = new BusMetrics(bus_id, timestamp, route_id, route_shift, device_id, position, speed, fuel, passengers);
        //busMetricsRepository.save(busMetrics); // Save the instance to Cassandra

        // Send to Cassandra
        // insertMetrics(session, bus_id, timestamp, route_id, route_shift, device_id, position, speed, fuel, passengers);

        cassandra_connector.close();
        
    }

     // Query protected against SQL injection
     public void insertMetrics(CqlSession session, String bus_id, Long timestamp, String route_id, String route_shift, String device_id, String[] position, Double speed, Double fuel, int passengers) {
        // Insert the given message into the "messages" table in Cassandra
        String cql = "INSERT INTO bus_metrics (bus_id, timestamp, route_id, route_shift, device_id, position, speed, fuel, passengers) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
        PreparedStatement preparedStatement = session.prepare(cql);
        BoundStatement boundStatement = preparedStatement.bind(bus_id, timestamp, route_id, route_shift, device_id, position, speed, fuel, passengers);
        session.execute(boundStatement);
    }

}