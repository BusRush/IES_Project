package ies.project.busrush.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalTime;

@Data
@AllArgsConstructor

public class ScheduleDto {
    private RouteDto route;
    private StopDto stop;
    private LocalTime time;
}
