package ies.project.busrush.service;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Service;
import org.json.JSONObject;
import com.fasterxml.jackson.databind.ObjectMapper;
import ies.project.busrush.repository.cassandra.BusMetricsRepository;

import ies.project.busrush.model.cassandra.BusMetrics;


@Service
public class QueueService {

    private final CassandraService cassandraService;
    private final BusRushService busRushService;
    private final BusMetricsRepository busMetricsRepository;

    public QueueService(CassandraService cassandraService, BusRushService busRushService, BusMetricsRepository busMetricsRepository) {
        this.cassandraService = cassandraService;
        this.busRushService = busRushService;
        this.busMetricsRepository = busMetricsRepository;
    }

    @RabbitListener(queues = "devices")
    public void receive(@Payload String msg) {

        // msg : {'device_id': 'AVRBUS-D0001', 'route_id': 'AVRBUS-L04', 'route_shift': '083000', 'timestamp': 1670868915, 'position': [40.63554147, -8.65516931], 'speed': 15.156, 'fuel': 98.878, 'passengers': 15}

        System.out.println("Received: " + msg); 
        cassandraService.createTable();
        System.out.println("Table created");

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

        // Get field bus_id from MySQL
        String bus_id = busRushService.getBusID(device_id);

        System.out.println("BUS ID: " + bus_id);

        // Create an instance of BusMetrics with some values
        BusMetrics busMetrics = new BusMetrics(bus_id, timestamp, route_id, route_shift, device_id, position, speed, fuel, passengers);
        busMetricsRepository.save(busMetrics); // Save the instance to Cassandra

        // Send to Cassandra
        cassandraService.insertMetrics(bus_id, timestamp, route_id, route_shift, device_id, position, speed, fuel, passengers);
        
    }

}