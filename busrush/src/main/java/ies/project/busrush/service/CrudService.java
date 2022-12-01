package ies.project.busrush.service;

import ies.project.busrush.dto.*;
import ies.project.busrush.dto.crud.BusCrudDto;
import ies.project.busrush.model.*;
import ies.project.busrush.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class CrudService {
    private BusRepository busRepository;
    private DeviceRepository deviceRepository;
    private DriverRepository driverRepository;
    private RouteRepository routeRepository;
    private ScheduleRepository scheduleRepository;
    private StopRepository stopRepository;
    private UserRepository userRepository;

    @Autowired
    public CrudService(
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

    // Buses
    public ResponseEntity<List<BusCrudDto>> getAllBuses() {
        try {
            List<Bus> buses = busRepository.findAll();
            if (buses.isEmpty())
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);

            List<BusCrudDto> busesCrudDto = new ArrayList<>();
            for (Bus bus : buses) {
                busesCrudDto.add(new BusCrudDto(
                        bus.getId(),
                        bus.getRegistration(),
                        bus.getBrand(),
                        bus.getModel(),
                        (bus.getDevice() != null) ? bus.getDevice().getId() : null,
                        bus.getRoutes().stream().map(route -> new RouteIdDto(route.getId().getId(), route.getId().getShift())).toArray(RouteIdDto[]::new)
                ));
            }
            return new ResponseEntity<>(busesCrudDto, HttpStatus.OK);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public ResponseEntity<BusCrudDto> getBusById(String id) {
        try {
            Optional<Bus> bus = busRepository.findById(id);
            if (bus.isEmpty())
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);

            BusCrudDto buseCrudDto = new BusCrudDto(
                    bus.get().getId(),
                    bus.get().getRegistration(),
                    bus.get().getBrand(),
                    bus.get().getModel(),
                    (bus.get().getDevice() != null) ? bus.get().getDevice().getId() : null,
                    bus.get().getRoutes().stream().map(route -> new RouteIdDto(route.getId().getId(), route.getId().getShift())).toArray(RouteIdDto[]::new)
            );
            return new ResponseEntity<>(buseCrudDto, HttpStatus.OK);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public ResponseEntity<BusCrudDto> createBus(BusCrudDto busCrudDto) {
        try {
            // Check if bus already exists
            Optional<Bus> bus = busRepository.findById(busCrudDto.getId());
            if (bus.isPresent())
                return new ResponseEntity<>(HttpStatus.CONFLICT);

            // Check if device exists
            Device _device = null;
            if (busCrudDto.getDeviceId() != null) {
                Optional<Device> device = deviceRepository.findById(busCrudDto.getDeviceId());
                if (device.isEmpty())
                    return new ResponseEntity<>(HttpStatus.UNPROCESSABLE_ENTITY);
                _device = device.get();
            }

            // Check if routes exist
            List<Route> _routes = new ArrayList<>();
            if (busCrudDto.getRoutesId() != null) {
                for (RouteIdDto routeIdDto : busCrudDto.getRoutesId()) {
                    Optional<Route> route = routeRepository.findByRouteId(new RouteId(routeIdDto.getId(), routeIdDto.getShift()));
                    if (route.isEmpty())
                        return new ResponseEntity<>(HttpStatus.UNPROCESSABLE_ENTITY);
                    else
                        _routes.add(route.get());
                }
            }

            busRepository.save(new Bus(
                    busCrudDto.getId(),
                    busCrudDto.getRegistration(),
                    busCrudDto.getBrand(),
                    busCrudDto.getModel(),
                    _device,
                    _routes
            ));
            return new ResponseEntity<>(busCrudDto, HttpStatus.CREATED);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public ResponseEntity<BusCrudDto> updateBus(String id, BusCrudDto busCrudDto) {
        try {
            Optional<Bus> bus = busRepository.findById(id);
            if (bus.isEmpty())
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);

            // Check if device exists
            Device _device = null;
            if (busCrudDto.getDeviceId() != null) {
                Optional<Device> device = deviceRepository.findById(busCrudDto.getDeviceId());
                if (device.isEmpty())
                    return new ResponseEntity<>(HttpStatus.UNPROCESSABLE_ENTITY);
                _device = device.get();
            }

            // Check if routes exist
            List<Route> _routes = new ArrayList<>();
            if (busCrudDto.getRoutesId() != null) {
                for (RouteIdDto routeIdDto : busCrudDto.getRoutesId()) {
                    Optional<Route> route = routeRepository.findByRouteId(new RouteId(routeIdDto.getId(), routeIdDto.getShift()));
                    if (route.isEmpty())
                        return new ResponseEntity<>(HttpStatus.UNPROCESSABLE_ENTITY);
                    else
                        _routes.add(route.get());
                }
            }

            Bus _bus = bus.get();
            _bus.setRegistration(busCrudDto.getRegistration());
            _bus.setBrand(busCrudDto.getBrand());
            _bus.setModel(busCrudDto.getModel());
            _bus.setDevice(_device);
            _bus.setRoutes(_routes);
            busRepository.save(_bus);

            busCrudDto.setId(id);
            return new ResponseEntity<>(busCrudDto, HttpStatus.OK);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public ResponseEntity<HttpStatus> deleteBus(String id) {
        try {
            busRepository.deleteById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
