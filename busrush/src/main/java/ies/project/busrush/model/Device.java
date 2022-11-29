package ies.project.busrush.model;

import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.persistence.*;

@Entity
@Table(name = "devices")
@Data
@NoArgsConstructor

public class Device {
    @Id
    private String id;

    @Column(name="model", nullable = false)
    private String model;

    @Column(name="serial_number", nullable = false)
    private Integer serialNumber;
}
