package ies.project.busrush.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class StopWithDistanceDto {
    private String id;
    private String designation;
    private Double[] position;
    private Double distance;
}