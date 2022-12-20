package ies.project.busrush.service;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Service;
import ies.project.busrush.model.cassandra.BusMetrics;

import org.json.JSONObject;
import ies.project.busrush.repository.BusRepository;
import ies.project.busrush.repository.cassandra.BusMetricsRepository;

import java.util.*;

import org.json.JSONArray;


@Service
public class QueueService {
    private BusRepository busRepository;
    private BusMetricsRepository busMetricsRepository; 
    //private CqlSession session;

    public QueueService(BusRepository busRepository, BusMetricsRepository busMetricsRepository) {
        this.busRepository = busRepository;
        this.busMetricsRepository = busMetricsRepository; 
    }

    @RabbitListener(queues = "devices")
    public void receive(@Payload String msg) {

        System.out.println("Received: " + msg); 
        processMessage(msg); 
        
    }

    public void processMessage(String msg) {

        JSONObject json = new JSONObject(msg);

        String device_id = json.getString("device_id");
        String route_id = json.getString("route_id");
        String route_shift = json.getString("route_shift");
        Long timestamp = json.getLong("timestamp"); 
        JSONArray pos = json.getJSONArray("position");
        List<Double> position = new ArrayList<>(); 
        position.add(pos.getDouble(0));
        position.add(pos.getDouble(1));
        Double speed = json.getDouble("speed");
        Double fuel = json.getDouble("fuel");
        int passengers = json.getInt("passengers");

        // Get field bus_id from MySQL
        String bus_id = busRepository.findIdByDeviceId(device_id);
        System.out.println("BUS ID: " + bus_id);

        // Create an instance of BusMetrics with some values
        BusMetrics busMetrics = new BusMetrics(bus_id, timestamp, route_id, route_shift, device_id, position, speed, fuel, passengers);
        
        busMetricsRepository.save(busMetrics);

    }

}