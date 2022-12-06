package ies.project.busrush.service;

import org.springframework.amqp.core.Queue;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.context.annotation.Bean;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Service;


@Service
public class QueueService {

    @Bean
    public Queue create() {
        return new Queue("devices", false);
    }

    @RabbitListener(queues = "devices")
    public void receive(@Payload String msg) {
        System.out.println("Received: " + msg); // TODO: Do something useful
    }

}