package ies.project.busrush.model;

import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

import java.util.Collection;


@Data
@NoArgsConstructor
@Entity
@Table(name = "drivers")
public class Driver {
    @Id
    private String id;

    @Column(name = "first_name", nullable = false)
    private String firstName;

    @Column(name = "last_name", nullable = false)
    private String lastName;

    @OneToMany
    private Collection<Route> routes;
}
