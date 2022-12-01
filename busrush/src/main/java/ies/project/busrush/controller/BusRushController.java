package ies.project.busrush.controller;

import ies.project.busrush.dto.ScheduleDto;
import ies.project.busrush.dto.StopWithDistanceDto;
import ies.project.busrush.service.BusRushService;
import ies.project.busrush.dto.StopDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api")
public class BusRushController {

    @Autowired
    private BusRushService busRushService;

    @GetMapping("/stops/closest")
    public ResponseEntity<StopWithDistanceDto> getClosestStop(
            @RequestParam(value = "lat") Double lat,
            @RequestParam(value = "lon") Double lon
    ) {
        return busRushService.getClosestStop(lat, lon);
    }

    @GetMapping("/schedules/next")
    public ResponseEntity<List<ScheduleDto>> getNextSchedules(
            @RequestParam(value = "origin_stop_id") Optional<String> originStopId,
            @RequestParam(value = "destination_stop_id") Optional<String> destinationStopId
    ) {
        return busRushService.getNextSchedules(originStopId, destinationStopId);
    }
}