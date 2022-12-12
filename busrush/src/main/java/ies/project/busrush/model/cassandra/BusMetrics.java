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

// {'device_id': 'AVRBUS-D0001', 'route_id': 'AVRBUS-L04', 'route_shift': '083000', 'timestamp': 1670868915, 'position': [40.63554147, -8.65516931], 'speed': 15.156, 'fuel': 98.878, 'passengers': 15}

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

    @Column("route_id") private String route_id;
    @Column("device_id") private String device_id;
    @Column("position") private String[] position;
    @Column("speed") private Double speed;
    @Column("fuel") private Double fuel;
    @Column("passengers") private int passengers;
    
}
