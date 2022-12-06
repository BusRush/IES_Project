package ies.project.busrush.service;

import ies.project.busrush.dto.basic.RouteBasicDto;
import ies.project.busrush.dto.busrush.NextScheduleDto;
import ies.project.busrush.dto.busrush.ClosestStopDto;
import ies.project.busrush.dto.id.RouteIdDto;
import ies.project.busrush.model.*;
import ies.project.busrush.model.custom.StopWithDistance;
import ies.project.busrush.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalTime;
import java.util.*;

@Service
public class BusRushService {
    private BusRepository busRepository;
    private DeviceRepository deviceRepository;
    private DriverRepository driverRepository;
    private RouteRepository routeRepository;
    private ScheduleRepository scheduleRepository;
    private StopRepository stopRepository;
    private UserRepository userRepository;

    @Autowired
    public BusRushService(
            BusRepository busRepository,
            DeviceRepository deviceRepository,
            DriverRepository driverRepository,
            RouteRepository routeRepository,
            ScheduleRepository scheduleRepository,
            StopRepository stopRepository,
            UserRepository userRepository
    ) {
        this.busRepository = busRepository;
        this.deviceRepository = deviceRepository;
        this.driverRepository = driverRepository;
        this.routeRepository = routeRepository;
        this.scheduleRepository = scheduleRepository;
        this.stopRepository = stopRepository;
        this.userRepository = userRepository;
    }


    public ResponseEntity<ClosestStopDto> getClosestStop(Double lat, Double lon) {
        List<StopWithDistance> stopWithDistance = stopRepository.findClosest(lat, lon, PageRequest.of(0, 1));
        if (stopWithDistance.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        StopWithDistance _stopWithDistance = stopWithDistance.get(0);
        ClosestStopDto closestStopDto = new ClosestStopDto(
                _stopWithDistance.getStop().getId(),
                _stopWithDistance.getStop().getDesignation(),
                new Double[]{_stopWithDistance.getStop().getLat(), _stopWithDistance.getStop().getLon()},
                _stopWithDistance.getDistance());
        return new ResponseEntity<>(closestStopDto, HttpStatus.OK);
    }

    public ResponseEntity<List<NextScheduleDto>> getNextSchedules(Optional<String> originStopId, Optional<String> destinationStopId) {
        List<Schedule> schedules = new ArrayList<>();
        LocalTime currentTime = LocalTime.of(8, 0, 0); // TODO: replace with LocalTime.now();
        if (originStopId.isPresent() && destinationStopId.isEmpty()) {
            // All schedules of routes that pass through the origin stop
            schedules = scheduleRepository.findSchedulesByStopAndCurrentTime(originStopId.get(), currentTime);
        } else if (originStopId.isEmpty() && destinationStopId.isPresent()) {
            // All schedules of routes that pass through the destination stop
            schedules = scheduleRepository.findSchedulesByStopAndCurrentTime(destinationStopId.get(), currentTime);
        } else if (originStopId.isPresent() && destinationStopId.isPresent()) {
            // All schedules of routes that pass through the origin stop and destination stop
            schedules = scheduleRepository.findSchedulesByOriginStopAndDestinationStopAndCurrentTime(originStopId.get(), destinationStopId.get(), currentTime);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        if (schedules.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        List<NextScheduleDto> schedulesDto = new ArrayList<>();
        Set<String> seenRouteIds = new HashSet<>();
        for (Schedule schedule : schedules) {
            if (!seenRouteIds.contains(schedule.getRoute().getId().getId())) {
                RouteBasicDto routeBasicDto = new RouteBasicDto(
                        new RouteIdDto(
                                schedule.getRoute().getId().getId(),
                                schedule.getRoute().getId().getShift()),
                        schedule.getRoute().getDesignation());
                schedulesDto.add(new NextScheduleDto(
                        routeBasicDto,
                        schedule.getTime()));
                seenRouteIds.add(schedule.getRoute().getId().getId());
            }
        }
        return new ResponseEntity<>(schedulesDto, HttpStatus.OK);
    }
}
