package ies.project.busrush.model;

import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.persistence.*;

@Entity
@Table(name = "buses")
@Data
@NoArgsConstructor

public class Bus {
    @Id
    private String id;

    @Column(name="registration", nullable = false)
    private String registration;

    @Column(name="brand", nullable = false)
    private String brand;

    @Column(name="model", nullable = false)
    private String model;

    @OneToOne(optional = false)
    @JoinColumn(name = "device_id", nullable = false)
    private Device device;
}
