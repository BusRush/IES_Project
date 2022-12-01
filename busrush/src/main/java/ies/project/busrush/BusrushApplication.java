package ies.project.busrush;

import org.springframework.amqp.rabbit.annotation.EnableRabbit;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.cassandra.CassandraAutoConfiguration;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.boot.autoconfigure.orm.jpa.HibernateJpaAutoConfiguration;

@EnableRabbit
@SpringBootApplication(exclude = {CassandraAutoConfiguration.class})
public class BusrushApplication {

    public static void main(String[] args) {
        SpringApplication.run(BusrushApplication.class, args);
    }

}
