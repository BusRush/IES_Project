package ies.project.busrush.service;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Service;


@Service
public class QueueService {

    @RabbitListener(queues = "devices")
    public void receive(@Payload String msg) {
        System.out.println("Received: " + msg); // TODO: Do something useful
    }

}