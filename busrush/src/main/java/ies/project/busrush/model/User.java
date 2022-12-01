package ies.project.busrush.model;

import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Data
@NoArgsConstructor
@Entity
@Table(name = "users")
public class User {
    @Id
    private String username;

    @Column(name = "password", nullable = false)
    private String password;
}
