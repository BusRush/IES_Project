package ies.project.busrush.service;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;

import ies.project.busrush.model.cassandra.BusMetrics;


@Service
public class QueueService {

    private final CassandraService cassandraService;
    private final BusRushService busRushService;

    public QueueService(CassandraService cassandraService, BusRushService busRushService) {
        this.cassandraService = cassandraService;
        this.busRushService = busRushService;
    }

    @RabbitListener(queues = "devices")
    public void receive(@Payload String msg) {
        System.out.println("Received: " + msg); 
       
        // Processing the message
        processMessage(msg);

        cassandraService.insertMetric(msg);
    }

    public void processMessage(@Payload String msg) {

        // Parsing the JSON to get the fields
        ObjectMapper mapper = new ObjectMapper();

        
        //BusMetrics busMetrics = mapper.readValue(msg, BusMetrics.class);
       

    }

}