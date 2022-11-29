package ies.project.busrush.model;

import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.persistence.*;

@Entity
@Table(name = "routes")
@Data
@NoArgsConstructor

public class Route {
    @Id
    private String id;

    @Column(name="designation", nullable = false)
    private String designation;

    @OneToOne(optional = false)
    @JoinColumn(name = "driver_id", nullable = false)
    private Driver driver;

    @OneToOne(optional = false)
    @JoinColumn(name = "bus_id", nullable = false)
    private Bus bus;
}
