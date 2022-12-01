package ies.project.busrush.service;

import ies.project.busrush.dto.RouteDto;
import ies.project.busrush.dto.ScheduleDto;
import ies.project.busrush.dto.StopDto;
import ies.project.busrush.dto.StopWithDistanceDto;
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

        // Clear all records on tables
        busRepository.deleteAll();
        deviceRepository.deleteAll();
        driverRepository.deleteAll();
        scheduleRepository.deleteAll(); // Delete before route and stop repositories (FK constraint)
        routeRepository.deleteAll();
        stopRepository.deleteAll();
        userRepository.deleteAll();
        // Insert in stops
        List<Stop> stops = new ArrayList<>();
        stops.add(new Stop("1", "Terminal Rodoviário de Aveiro", 40.64404, -8.63906, null));
        stops.add(new Stop("2", "Av. Dr. Lourenço Peixinho - CTT B", 40.6434, -8.64491, null));
        stopRepository.saveAll(stops);
        // Insert in routes
        List<Route> routes = new ArrayList<>();
        routes.add(new Route(new RouteId("AVRBUS-L0011", "092000"), "Linha 11", null, null, null));
        routeRepository.saveAll(routes);
        // Insert in schedules
        List<Schedule> schedules = new ArrayList<>();
        schedules.add(new Schedule(new ScheduleId(routes.get(0).getId(), stops.get(0).getId()), routes.get(0), stops.get(0), LocalTime.of(9, 20, 0)));
        schedules.add(new Schedule(new ScheduleId(routes.get(0).getId(), stops.get(1).getId()), routes.get(0), stops.get(1), LocalTime.of(9, 21, 0)));
        scheduleRepository.saveAll(schedules);
    }


    public ResponseEntity<StopWithDistanceDto> getClosestStop(Double lat, Double lon) {
        List<StopWithDistance> stopWithDistance = stopRepository.findClosest(lat, lon, PageRequest.of(0, 1));
        if (stopWithDistance.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        StopWithDistance _stopWithDistance = stopWithDistance.get(0);
        StopWithDistanceDto stopWithDistanceDto = new StopWithDistanceDto(
                _stopWithDistance.getStop().getId(),
                _stopWithDistance.getStop().getDesignation(),
                new Double[]{_stopWithDistance.getStop().getLat(), _stopWithDistance.getStop().getLon()},
                _stopWithDistance.getDistance());
        return new ResponseEntity<>(stopWithDistanceDto, HttpStatus.OK);
    }

    public ResponseEntity<List<ScheduleDto>> getNextSchedules(Optional<String> originStopId, Optional<String> destinationStopId) {
        List<Schedule> schedules = new ArrayList<>();
        LocalTime currentTime = LocalTime.now();
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

        List<ScheduleDto> schedulesDto = new ArrayList<>();
        Set<String> seenRouteIds = new HashSet<>();
        for (Schedule schedule : schedules) {
            if (!seenRouteIds.contains(schedule.getRoute().getId().getId())) {
                RouteDto routeDto = new RouteDto(
                        schedule.getRoute().getId().getId(),
                        schedule.getRoute().getDesignation());
                StopDto stopDto = new StopDto(
                        schedule.getStop().getId(),
                        schedule.getStop().getDesignation(),
                        new Double[]{schedule.getStop().getLat(), schedule.getStop().getLon()});
                schedulesDto.add(new ScheduleDto(
                        routeDto,
                        stopDto,
                        schedule.getTime()));
                seenRouteIds.add(schedule.getRoute().getId().getId());
            }
        }
        return new ResponseEntity<>(schedulesDto, HttpStatus.OK);
    }
}
