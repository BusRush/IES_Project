package ies.project.busrush.model;

import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.persistence.*;

@Entity
@Table(name = "stops")
@Data
@NoArgsConstructor
public class Stop {
    @Id
    private String id;

    @Column(name="designation", nullable = false)
    private String designation;

    @Column(name="latitude", nullable = false)
    private double latitude;

    @Column(name="longitude", nullable = false)
    private double longitude;
}
