package ies.project.busrush.model;

import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.persistence.*;

import java.time.LocalTime;

@Entity
@Table(name = "schedules")
@IdClass(ScheduleID.class)
@Data
@NoArgsConstructor
public class Schedule {
    @Id
    @OneToOne(optional = false)
    @JoinColumn(name = "route_id", nullable = false)
    private Route route;

    @Id
    @OneToOne(optional = false)
    @JoinColumn(name = "stop_id", nullable = false)
    private Stop stop;

    @Column(name="time", nullable = false)
    private LocalTime time;

}
