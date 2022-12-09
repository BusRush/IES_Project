package ies.project.busrush.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Embeddable
public class RouteId implements Serializable {
    @Column(name = "id")
    private String id;
    @Column(name = "shift")
    private String shift;
    @Override
    public String toString() {
        return id + "_" + shift;
    }
}
