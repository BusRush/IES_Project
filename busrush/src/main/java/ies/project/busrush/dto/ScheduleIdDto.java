package ies.project.busrush.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ScheduleIdDto {
    private RouteIdDto routeId;
    private String stopId;
    private Integer sequence;
}
