package ies.project.busrush.service;

import ies.project.busrush.dto.basic.BusBasicDto;
import ies.project.busrush.dto.basic.RouteBasicDto;
import ies.project.busrush.dto.basic.StopBasicDto;
import ies.project.busrush.dto.busrush.InfoScheduleDto;
import ies.project.busrush.dto.busrush.NextScheduleDto;
import ies.project.busrush.dto.busrush.ClosestStopDto;
import ies.project.busrush.dto.id.RouteIdDto;
import ies.project.busrush.model.*;
import ies.project.busrush.model.custom.StopWithDistance;
import ies.project.busrush.repository.*;
import ies.project.busrush.util.Coordinates;
import ies.project.busrush.util.OSRMAdapter;
import ies.project.busrush.util.StopDurationIndex;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalTime;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

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

    // Get the bus id from the device id
    public String getBusID(String deviceId) {
        return busRepository.findBusIdByDeviceId(deviceId);
    }

    public ResponseEntity<List<NextScheduleDto>> getNextSchedules(String originStopId, Optional<String> destinationStopId) {

        LocalTime currentTime = LocalTime.now().truncatedTo(ChronoUnit.SECONDS);

        // Find all schedules on origin stop (that go to destination stop if provided)
        List<Schedule> originSchedules;
        if (destinationStopId.isEmpty()) {
            originSchedules = scheduleRepository.findAllByStopId(originStopId);
        } else {
            originSchedules = scheduleRepository.findAllByOriginStopIdAndDestinationStopId(originStopId, destinationStopId.get());
        }
        if (originSchedules.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        // Reorder schedules on origin stop according to the current time (i.e. next schedules must appear first in the list)
        int sliceIndex = 0;
        for (int i = 1; i < originSchedules.size(); i++) {
            Schedule testSchedule = originSchedules.get(i);
            // The first schedule that passes through the origin stop after the current time is the head of the list
            // because the list is already sorted by time
            if (testSchedule.getTime().isAfter(currentTime)) {
                sliceIndex = i;
                break;
            }
        }
        List<Schedule> head = originSchedules.subList(sliceIndex, originSchedules.size());
        List<Schedule> tail = originSchedules.subList(0, sliceIndex);
        List<Schedule> join = new ArrayList<>();
        join.addAll(head);
        join.addAll(tail);
        originSchedules = join;

        // Filter schedules on origin stop so that we only get the next from a given route
        List<Schedule> nextSchedules = new ArrayList<>();
        Set<String> seenRouteIds = new HashSet<>();
        for (Schedule os : originSchedules) {
            String routeId = os.getRoute().getId().getId();
            Bus bus = os.getRoute().getBus();
            if (bus == null) continue; // No bus assigned to this route
            // We only want the next schedule for each route
            if (!seenRouteIds.contains(routeId)) {
                nextSchedules.add(os);
                seenRouteIds.add(routeId);
            }
        }
        originSchedules = nextSchedules;

        // For each origin schedule...
        //
        // What we have:
        // - the schedule's route id (id + shift)                                - to return
        // - the schedule's route designation                                    - to return
        // - the schedule's sequence number                                      - to compute delay
        // - the schedule's time of arrival at origin stop                       - to compute delay
        //
        // What is missing:
        // - the bus associated with the schedule's route and its location
        // - the schedule for the next stop of the bus and time of arrival there
        // - the estimated time of arrival of the bus to origin stop             - to return
        // - the delay of the bus to origin stop                                 - to return

        List<NextScheduleDto> originSchedulesDto = new ArrayList<>();
        for (Schedule os : originSchedules) {
            Integer osSequence = os.getId().getSequence();
            RouteId osRouteId = os.getRoute().getId();
            String osRouteDesignation = os.getRoute().getDesignation();
            LocalTime osTime = os.getTime();

            // Find all other schedules and stops of this schedule's route
            List<Schedule> allRouteSchedules = os.getRoute().getSchedules();
            List<Stop> allRouteStops = allRouteSchedules.stream()
                    .map(Schedule::getStop)
                    .collect(Collectors.toCollection(ArrayList::new));

            // Find the bus associated with the schedule's route
            Bus bus = os.getRoute().getBus();
            // Find the current location of the bus
            Coordinates busLocation = new Coordinates(40.643632, -8.643966); // TODO: Query Cassandra - use busId and routeId

            // Find the next stop of the bus
            StopDurationIndex busNext = OSRMAdapter.getNextStop(busLocation, allRouteStops);
            // Find the schedule for the next stop of the bus
            Schedule ns = allRouteSchedules.get(busNext.getIndex());
            Integer nsSequence = ns.getId().getSequence();
            if (nsSequence > osSequence) continue; // The bus has already passed by the origin stop
            LocalTime nsTime = ns.getTime();
            // Find the time of arrival (in seconds without new day wrap) to next stop and origin stop
            Double nsTimeSeconds = (double) nsTime.toSecondOfDay();
            Double osTimeSeconds = (double) ((nsTime.isAfter(osTime)) ? 86400 + osTime.toSecondOfDay() : osTime.toSecondOfDay());

            // Compute the duration of the trip bus->next->origin
            Double busNextDuration = busNext.getDuration();
            Double nextOriginDuration = osTimeSeconds - nsTimeSeconds;
            Double busOriginDuration = busNextDuration + nextOriginDuration;
            // Compute the time of arrival of the bus to origin stop
            Double busTimeSeconds = currentTime.toSecondOfDay() + busOriginDuration;
            LocalTime busTime = LocalTime.ofSecondOfDay(busTimeSeconds.longValue() % 86400);
            // Compute the delay of the bus to origin stop
            Double busDelay = busTimeSeconds - osTimeSeconds;

            originSchedulesDto.add(new NextScheduleDto(
                    os.getId().toString(),
                    new RouteBasicDto(
                            osRouteId.toString(),
                            osRouteDesignation
                    ),
                    busTime,
                    busDelay
            ));
        }
        return new ResponseEntity<>(originSchedulesDto, HttpStatus.OK);
    }

    public ResponseEntity<InfoScheduleDto> getInfoSchedule(String id) {

        LocalTime currentTime = LocalTime.now().truncatedTo(ChronoUnit.SECONDS);
        ScheduleId scheduleId = ScheduleId.fromString(id);

        // Find the target schedule
        Optional<Schedule> _ts = scheduleRepository.findByScheduleId(scheduleId);
        if (_ts.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        Schedule ts = _ts.get();
        Integer tsSequence = ts.getId().getSequence();
        LocalTime tsTime = ts.getTime();

        // Find all other schedules and stops of this target schedule's route
        List<Schedule> allRouteSchedules = ts.getRoute().getSchedules();
        List<Stop> allRouteStops = allRouteSchedules.stream()
                .map(Schedule::getStop)
                .collect(Collectors.toCollection(ArrayList::new));

        // Find the bus associated with the target schedule's route
        Bus bus = ts.getRoute().getBus(); // Should never be null
        // Find the current location of the bus
        Coordinates busLocation = new Coordinates(40.643632, -8.643966); // TODO: Query Cassandra - use busId and routeId
        // Find the current number of passengers on the bus
        Integer busPassengers = 10; // TODO: Query Cassandra - use busId and routeId

        // Find the next stop of the bus
        StopDurationIndex busNext = OSRMAdapter.getNextStop(busLocation, allRouteStops);
        // Find the schedule for the next stop of the bus
        Schedule ns = allRouteSchedules.get(busNext.getIndex());
        Integer nsSequence = ns.getId().getSequence();
        if (nsSequence > tsSequence) {
            // The bus has already passed by the target stop
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        LocalTime nsTime = ns.getTime();
        // Find the time of arrival (in seconds without new day wrap) to next stop and target stop
        Double nsTimeSeconds = (double) nsTime.toSecondOfDay();
        Double tsTimeSeconds = (double) ((nsTime.isAfter(tsTime)) ? 86400 + tsTime.toSecondOfDay() : tsTime.toSecondOfDay());

        // Compute the duration of the trip bus->next->target
        Double busNextDuration = busNext.getDuration();
        Double nextTargetDuration = tsTimeSeconds - nsTimeSeconds;
        Double busTargetDuration = busNextDuration + nextTargetDuration;
        // Compute the time of arrival of the bus to target stop
        Double busTimeSeconds = currentTime.toSecondOfDay() + busTargetDuration;
        LocalTime busTime = LocalTime.ofSecondOfDay(busTimeSeconds.longValue() % 86400);
        // Compute the delay of the bus to target stop
        Double busDelay = busTimeSeconds - tsTimeSeconds;

        InfoScheduleDto infoScheduleDto = new InfoScheduleDto(
                ts.getId().toString(),
                new BusBasicDto(
                        bus.getId(),
                        bus.getRegistration(),
                        bus.getBrand(),
                        bus.getModel()
                ),
                busPassengers,
                new StopBasicDto(
                        ns.getStop().getId(),
                        ns.getStop().getDesignation()
                ),
                busTime,
                busDelay
        );
        return new ResponseEntity<>(infoScheduleDto, HttpStatus.OK);
    }
}
