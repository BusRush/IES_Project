package ies.project.busrush;

import org.springframework.amqp.rabbit.annotation.EnableRabbit;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.cassandra.repository.config.EnableCassandraRepositories;
import org.springframework.data.keyvalue.annotation.KeySpace;
//import org.springframework.boot.autoconfigure.cassandra.CassandraAutoConfiguration;
import org.springframework.beans.factory.annotation.Autowired;
import ies.project.busrush.repository.cassandra.BusMetricsRepository;

@EnableRabbit
@EnableCassandraRepositories
@SpringBootApplication
public class BusrushApplication {

    @Autowired
    private BusMetricsRepository busMetricsRepository;

    public static void main(String[] args) {
        SpringApplication.run(BusrushApplication.class, args);
        

    }

}