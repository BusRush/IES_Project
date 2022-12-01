package ies.project.busrush.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalTime;

@Data
@AllArgsConstructor
public class RouteDto {
    private String id;
    private String designation;
}
