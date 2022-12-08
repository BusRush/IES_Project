package ies.project.busrush.util;

import ies.project.busrush.model.Stop;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StopDuration {
    Stop stop;
    Double duration;
}
