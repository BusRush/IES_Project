package ies.project.busrush.service;

import ies.project.busrush.dto.basic.RouteBasicDto;
import ies.project.busrush.dto.busrush.NextScheduleDto;
import ies.project.busrush.dto.busrush.ClosestStopDto;
import ies.project.busrush.dto.id.RouteIdDto;
import ies.project.busrush.model.*;
import ies.project.busrush.model.custom.StopWithDistance;
import ies.project.busrush.repository.*;
import ies.project.busrush.util.OSRMAdapter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalTime;
import java.time.temporal.ChronoUnit;
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

    public ResponseEntity<List<NextScheduleDto>> getNextSchedules(String originStopId, Optional<String> destinationStopId) {

        LocalTime currentTime = LocalTime.now().truncatedTo(ChronoUnit.SECONDS);

        // Find all schedules that pass through the origin stop (and destination stop if provided)
        List<Schedule> schedules;
        if (destinationStopId.isEmpty()) {
            schedules = scheduleRepository.findAllByStopId(originStopId);
        } else {
            schedules = scheduleRepository.findAllByOriginStopIdAndDestinationStopId(originStopId, destinationStopId.get());
        }
        if (schedules.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        // Reorder schedules according to the current time (i.e. next schedules must appear first in the list)
        // TODO: we are assuming buses always have a positive delay (i.e. they never arrive earlier than expected)
        int sliceIndex = 0;
        for (int i = 1; i < schedules.size(); i++) {
            Schedule prevSchedule = schedules.get(i - 1);
            Schedule currSchedule = schedules.get(i);
            // The first schedule that passes through the origin stop after the current time is the head of the list
            // because the list is already sorted by time
            if (currSchedule.getTime().isAfter(currentTime) || currSchedule.getTime().isBefore(prevSchedule.getTime())) {
                sliceIndex = i;
                break;
            }
        }
        List<Schedule> newHeadPart = schedules.subList(sliceIndex, schedules.size());
        List<Schedule> newTailPart = schedules.subList(0, sliceIndex);
        List<Schedule> newSchedules = new ArrayList<>();
        newSchedules.addAll(newHeadPart);
        newSchedules.addAll(newTailPart);
        schedules = newSchedules;

        // Filter the next schedule for each route based on the current time
        List<Schedule> nextSchedules = new ArrayList<>();
        Set<String> seenRouteIds = new HashSet<>();
        for (Schedule schedule : schedules) {
            String routeId = schedule.getRoute().getId().getId();
            // We only want the next schedule for each route
            if (!seenRouteIds.contains(routeId)) {
                nextSchedules.add(schedule);
                seenRouteIds.add(routeId);
            }
        }

        Optional<Stop> _originStop = stopRepository.findById(originStopId);
        if (_originStop.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        Stop originStop = _originStop.get();

        List<NextScheduleDto> nextSchedulesDto = new ArrayList<>();
        for (Schedule schedule : nextSchedules) {
            // Find the bus associated with the schedule
            Bus bus = schedule.getRoute().getBus();
            // Find the current location of the bus
            Double[] location = {40.643632, -8.643966}; // TODO: Query Cassandra
            // Find the duration of the trip from its location to the origin stop
            Double duration = OSRMAdapter.getDuration(location[0], location[1], originStop.getLat(), originStop.getLon());
            // Compute the time the bus will arrive at the origin stop
            LocalTime predictedTime = currentTime.plusSeconds(duration.longValue());
            // Compute the delay of the bus relative to the scheduled time
            Integer delay;
            if (predictedTime.isBefore(currentTime)) {
                // Means the predicted time is on a new day
                delay = (86400 + predictedTime.toSecondOfDay()) - schedule.getTime().toSecondOfDay();
            } else {
                delay = predictedTime.toSecondOfDay() - schedule.getTime().toSecondOfDay();
            }

            RouteBasicDto routeBasicDto = new RouteBasicDto(
                    new RouteIdDto(
                            schedule.getRoute().getId().getId(),
                            schedule.getRoute().getId().getShift()
                    ),
                    schedule.getRoute().getDesignation()
            );
            nextSchedulesDto.add(new NextScheduleDto(routeBasicDto, predictedTime, delay));
            seenRouteIds.add(schedule.getRoute().getId().getId());
        }

        return new ResponseEntity<>(nextSchedulesDto, HttpStatus.OK);
    }
}
