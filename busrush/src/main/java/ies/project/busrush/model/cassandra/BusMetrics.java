package ies.project.busrush.model.cassandra;

import lombok.Data;
import lombok.NoArgsConstructor;

import org.springframework.data.cassandra.core.mapping.PrimaryKey;
import org.springframework.data.cassandra.core.mapping.Table;

import javax.persistence.*;

import java.util.Collection;

@Data
@NoArgsConstructor
@Table("busMetrics")
public class BusMetrics {

    @PrimaryKey
    private String id;

    @Column(name="registration", length = 8, nullable = false, unique = true)
    private String registration;

    @Column(name="brand", nullable = false)
    private String brand;

    @Column(name="model", nullable = false)
    private String model;

}
