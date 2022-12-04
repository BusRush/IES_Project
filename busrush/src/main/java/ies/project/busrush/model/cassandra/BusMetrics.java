package ies.project.busrush.model.cassandra;

import java.util.Date;
import lombok.Data;
import lombok.NoArgsConstructor;

import org.springframework.data.cassandra.core.mapping.PrimaryKey;
import org.springframework.data.cassandra.core.mapping.Column;
import org.springframework.data.cassandra.core.mapping.PrimaryKeyColumn;
import org.springframework.data.cassandra.core.mapping.Table;
import org.springframework.data.cassandra.core.cql.PrimaryKeyType;
import org.springframework.data.cassandra.core.cql.Ordering;

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
    
    @Column("speed") private Double speed;
    @Column("device_id") private String device_id;
    @Column("lat") private Double lat;
    @Column("lon") private Double lon;
    @Column("passengers") private int passengers;
    @Column("fuel") private Double fuel;
}
