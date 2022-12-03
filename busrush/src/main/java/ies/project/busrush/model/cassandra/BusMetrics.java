package ies.project.busrush.model.cassandra;

import java.sql.Date;
import lombok.Data;
import lombok.NoArgsConstructor;

import org.springframework.data.cassandra.core.mapping.PrimaryKey;
import org.springframework.data.cassandra.core.mapping.PrimaryKeyColumn;
import org.springframework.data.cassandra.core.mapping.Table;
import org.springframework.data.cassandra.core.cql.PrimaryKeyType;
import org.springframework.data.cassandra.core.cql.Ordering;

import javax.persistence.*;

import java.util.Collection;

@Data
@NoArgsConstructor
@Table("bus_metrics")
public class BusMetrics {

    @PrimaryKeyColumn(
        name = "bus_id", 
        ordinal = 0, 
        type = PrimaryKeyType.PARTITIONED)
    private String bus_id;

    @PrimaryKeyColumn(
        name = "device_id", 
        ordinal = 0, 
        type = PrimaryKeyType.PARTITIONED)
    private String device_id;

    @PrimaryKeyColumn(
        name = "date", 
        ordinal = 0, 
        type = PrimaryKeyType.PARTITIONED)
    private Date date;

    @PrimaryKeyColumn(
        name = "timestamp", 
        ordinal = 2, 
        type = PrimaryKeyType.CLUSTERED, 
        ordering = Ordering.ASCENDING)
    private long timestamp;
    
    private int passengers;
    private Double speed;
    private Double fuel; 
    private Double lat;
    private Double lon;


}
