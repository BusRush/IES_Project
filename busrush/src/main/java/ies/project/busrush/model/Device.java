package ies.project.busrush.model;

import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Data
@NoArgsConstructor
@Entity
@Table(name = "devices")
public class Device {
    @Id
    private String id;

    @OneToOne(mappedBy = "device")
    private Bus bus;
}
