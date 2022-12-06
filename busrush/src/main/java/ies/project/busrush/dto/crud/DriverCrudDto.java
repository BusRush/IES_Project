package ies.project.busrush.dto.crud;

import ies.project.busrush.dto.id.RouteIdDto;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class DriverCrudDto {
    private String id;
    private String firstName;
    private String lastName;
    private RouteIdDto[] routesId;
}
