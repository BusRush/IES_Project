package ies.project.busrush;

import org.springframework.amqp.rabbit.annotation.EnableRabbit;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@EnableRabbit
@SpringBootApplication
public class BusrushApplication {

    public static void main(String[] args) {
        SpringApplication.run(BusrushApplication.class, args);
    }

}