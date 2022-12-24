package ies.project.busrush.service;

import ies.project.busrush.dto.crud.*;
import ies.project.busrush.dto.id.RouteIdDto;
import ies.project.busrush.dto.id.ScheduleIdDto;
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

        // Clear all records on tables
        // scheduleRepository.deleteAll();
        // stopRepository.deleteAll();
        // routeRepository.deleteAll();
        // driverRepository.deleteAll();
        // busRepository.deleteAll();
        // deviceRepository.deleteAll();
        // userRepository.deleteAll();
    }

    //
    // Buses
    //
    public ResponseEntity<List<BusCrudDto>> getAllBuses(Optional<String> deviceId) {
        try {
            List<Bus> buses = busRepository.findAll();
            if (buses.isEmpty())
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);

            // Filters
            deviceId.ifPresent(_deviceId -> buses.removeIf(bus -> !bus.getDevice().getId().equals(_deviceId)));

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
            Optional<Bus> _bus = busRepository.findById(id);
            if (_bus.isEmpty())
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            Bus bus = _bus.get();

            BusCrudDto busCrudDto = new BusCrudDto(
                    bus.getId(),
                    bus.getRegistration(),
                    bus.getBrand(),
                    bus.getModel(),
                    (bus.getDevice() != null) ? bus.getDevice().getId() : null,
                    bus.getRoutes().stream().map(route -> new RouteIdDto(route.getId().getId(), route.getId().getShift())).toArray(RouteIdDto[]::new)
            );
            return new ResponseEntity<>(busCrudDto, HttpStatus.OK);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public ResponseEntity<BusCrudDto> createBus(BusCrudDto busCrudDto) {
        try {
            // Check if bus already exists
            Optional<Bus> _bus = busRepository.findById(busCrudDto.getId());
            if (_bus.isPresent())
                return new ResponseEntity<>(HttpStatus.CONFLICT);

            // Check if device exists
            Device device = null;
            if (busCrudDto.getDeviceId() != null) {
                Optional<Device> _device = deviceRepository.findById(busCrudDto.getDeviceId());
                if (_device.isEmpty())
                    return new ResponseEntity<>(HttpStatus.UNPROCESSABLE_ENTITY);
                device = _device.get();
                if (device.getBus() != null)
                    return new ResponseEntity<>(HttpStatus.CONFLICT);
            }

            // Check if routes exist
            List<Route> routes = new ArrayList<>();
            if (busCrudDto.getRoutesId() != null) {
                for (RouteIdDto routeIdDto : busCrudDto.getRoutesId()) {
                    Optional<Route> _route = routeRepository.findByRouteId(new RouteId(routeIdDto.getId(), routeIdDto.getShift()));
                    if (_route.isEmpty())
                        return new ResponseEntity<>(HttpStatus.UNPROCESSABLE_ENTITY);
                    Route route = _route.get();
                    if (route.getBus() != null)
                        return new ResponseEntity<>(HttpStatus.CONFLICT);
                    routes.add(route);
                }
            }

            busRepository.save(new Bus(
                    busCrudDto.getId(),
                    busCrudDto.getRegistration(),
                    busCrudDto.getBrand(),
                    busCrudDto.getModel(),
                    device,
                    routes
            ));
            return new ResponseEntity<>(busCrudDto, HttpStatus.CREATED);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public ResponseEntity<BusCrudDto> updateBus(String id, BusCrudDto busCrudDto) {
        try {
            Optional<Bus> _bus = busRepository.findById(id);
            if (_bus.isEmpty())
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            Bus bus = _bus.get();

            // Check if device exists
            Device device = null;
            if (busCrudDto.getDeviceId() != null) {
                Optional<Device> _device = deviceRepository.findById(busCrudDto.getDeviceId());
                if (_device.isEmpty())
                    return new ResponseEntity<>(HttpStatus.UNPROCESSABLE_ENTITY);
                device = _device.get();
                if (device.getBus() != null && !device.getBus().equals(bus))
                    return new ResponseEntity<>(HttpStatus.CONFLICT);
            }

            // Check if routes exist
            List<Route> routes = new ArrayList<>();
            if (busCrudDto.getRoutesId() != null) {
                for (RouteIdDto routeIdDto : busCrudDto.getRoutesId()) {
                    Optional<Route> _route = routeRepository.findByRouteId(new RouteId(routeIdDto.getId(), routeIdDto.getShift()));
                    if (_route.isEmpty())
                        return new ResponseEntity<>(HttpStatus.UNPROCESSABLE_ENTITY);
                    Route route = _route.get();
                    if (route.getBus() != null && !route.getBus().equals(bus))
                        return new ResponseEntity<>(HttpStatus.CONFLICT);
                    routes.add(route);
                }
            }

            bus.setRegistration(busCrudDto.getRegistration());
            bus.setBrand(busCrudDto.getBrand());
            bus.setModel(busCrudDto.getModel());
            bus.setDevice(device);
            bus.setRoutes(routes);
            busRepository.save(bus);

            busCrudDto.setId(bus.getId());
            return new ResponseEntity<>(busCrudDto, HttpStatus.OK);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public ResponseEntity<HttpStatus> deleteBus(String id) {
        try {
            Optional<Bus> _bus = busRepository.findById(id);
            if (_bus.isEmpty())
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            Bus bus = _bus.get();

            busRepository.delete(bus);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    //
    // Devices
    //
    public ResponseEntity<List<DeviceCrudDto>> getAllDevices() {
        try {
            List<Device> devices = deviceRepository.findAll();
            if (devices.isEmpty())
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);

            List<DeviceCrudDto> devicesCrudDto = new ArrayList<>();
            for (Device device : devices) {
                devicesCrudDto.add(new DeviceCrudDto(
                        device.getId(),
                        (device.getBus() != null) ? device.getBus().getId() : null
                ));
            }
            return new ResponseEntity<>(devicesCrudDto, HttpStatus.OK);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public ResponseEntity<DeviceCrudDto> getDeviceById(String id) {
        try {
            Optional<Device> _device = deviceRepository.findById(id);
            if (_device.isEmpty())
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            Device device = _device.get();

            DeviceCrudDto deviceCrudDto = new DeviceCrudDto(
                    device.getId(),
                    (device.getBus() != null) ? device.getBus().getId() : null
            );
            return new ResponseEntity<>(deviceCrudDto, HttpStatus.OK);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public ResponseEntity<DeviceCrudDto> createDevice(DeviceCrudDto deviceCrudDto) {
        try {
            // Check if device already exists
            Optional<Device> _device = deviceRepository.findById(deviceCrudDto.getId());
            if (_device.isPresent())
                return new ResponseEntity<>(HttpStatus.CONFLICT);

            // Check if bus exists
            Bus bus = null;
            if (deviceCrudDto.getBusId() != null) {
                Optional<Bus> _bus = busRepository.findById(deviceCrudDto.getBusId());
                if (_bus.isEmpty())
                    return new ResponseEntity<>(HttpStatus.UNPROCESSABLE_ENTITY);
                bus = _bus.get();
                if (bus.getDevice() != null)
                    return new ResponseEntity<>(HttpStatus.CONFLICT);
            }

            Device device = new Device(
                    deviceCrudDto.getId(),
                    null
            );
            deviceRepository.save(device);

            if (bus != null) {
                bus.setDevice(device);
                busRepository.save(bus);
            }
            return new ResponseEntity<>(deviceCrudDto, HttpStatus.CREATED);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public ResponseEntity<DeviceCrudDto> updateDevice(String id, DeviceCrudDto deviceCrudDto) {
        try {
            Optional<Device> _device = deviceRepository.findById(id);
            if (_device.isEmpty())
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            Device device = _device.get();

            // Check if bus exists
            Bus bus = null;
            if (deviceCrudDto.getBusId() != null) {
                Optional<Bus> _bus = busRepository.findById(deviceCrudDto.getBusId());
                if (_bus.isEmpty())
                    return new ResponseEntity<>(HttpStatus.UNPROCESSABLE_ENTITY);
                bus = _bus.get();
                if (bus.getDevice() != null && !bus.getDevice().equals(device))
                    return new ResponseEntity<>(HttpStatus.CONFLICT);
            }

            if (bus != null) {
                bus.setDevice(device);
                busRepository.save(bus);
            }

            deviceCrudDto.setId(device.getId());
            return new ResponseEntity<>(deviceCrudDto, HttpStatus.OK);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public ResponseEntity<HttpStatus> deleteDevice(String id) {
        try {
            Optional<Device> _device = deviceRepository.findById(id);
            if (_device.isEmpty())
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            Device device = _device.get();

            // Set bus device to null
            Bus bus = device.getBus();
            bus.setDevice(null);
            busRepository.save(bus);

            deviceRepository.delete(device);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    //
    // Drivers
    //
    public ResponseEntity<List<DriverCrudDto>> getAllDrivers() {
        try {
            List<Driver> drivers = driverRepository.findAll();
            if (drivers.isEmpty())
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);

            List<DriverCrudDto> driversCrudDto = new ArrayList<>();
            for (Driver driver : drivers) {
                driversCrudDto.add(new DriverCrudDto(
                        driver.getId(),
                        driver.getFirstName(),
                        driver.getLastName(),
                        driver.getRoutes().stream().map(route -> new RouteIdDto(route.getId().getId(), route.getId().getShift())).toArray(RouteIdDto[]::new)
                ));
            }
            return new ResponseEntity<>(driversCrudDto, HttpStatus.OK);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public ResponseEntity<DriverCrudDto> getDriverById(String id) {
        try {
            Optional<Driver> driver = driverRepository.findById(id);
            if (driver.isEmpty())
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);

            DriverCrudDto driverCrudDto = new DriverCrudDto(
                    driver.get().getId(),
                    driver.get().getFirstName(),
                    driver.get().getLastName(),
                    driver.get().getRoutes().stream().map(route -> new RouteIdDto(route.getId().getId(), route.getId().getShift())).toArray(RouteIdDto[]::new)
            );
            return new ResponseEntity<>(driverCrudDto, HttpStatus.OK);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public ResponseEntity<DriverCrudDto> createDriver(DriverCrudDto driverCrudDto) {
        try {
            // Check if driver already exists
            Optional<Driver> driver = driverRepository.findById(driverCrudDto.getId());
            if (driver.isPresent())
                return new ResponseEntity<>(HttpStatus.CONFLICT);

            // Check if routes exist
            List<Route> _routes = new ArrayList<>();
            if (driverCrudDto.getRoutesId() != null) {
                for (RouteIdDto routeIdDto : driverCrudDto.getRoutesId()) {
                    Optional<Route> route = routeRepository.findByRouteId(new RouteId(routeIdDto.getId(), routeIdDto.getShift()));
                    if (route.isEmpty())
                        return new ResponseEntity<>(HttpStatus.UNPROCESSABLE_ENTITY);
                    Route _route = route.get();
                    if (_route.getDriver() != null)
                        return new ResponseEntity<>(HttpStatus.CONFLICT);
                    _routes.add(_route);
                }
            }

            driverRepository.save(new Driver(
                    driverCrudDto.getId(),
                    driverCrudDto.getFirstName(),
                    driverCrudDto.getLastName(),
                    _routes
            ));
            return new ResponseEntity<>(driverCrudDto, HttpStatus.CREATED);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public ResponseEntity<DriverCrudDto> updateDriver(String id, DriverCrudDto driverCrudDto) {
        try {
            Optional<Driver> driver = driverRepository.findById(id);
            if (driver.isEmpty())
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);

            // Check if routes exist
            List<Route> _routes = new ArrayList<>();
            if (driverCrudDto.getRoutesId() != null) {
                for (RouteIdDto routeIdDto : driverCrudDto.getRoutesId()) {
                    Optional<Route> _route = routeRepository.findByRouteId(new RouteId(routeIdDto.getId(), routeIdDto.getShift()));
                    if (_route.isEmpty())
                        return new ResponseEntity<>(HttpStatus.UNPROCESSABLE_ENTITY);
                    _routes.add(_route.get());
                }
            }

            Driver _driver = driver.get();
            _driver.setFirstName(driverCrudDto.getFirstName());
            _driver.setLastName(driverCrudDto.getLastName());
            _driver.setRoutes(_routes);
            driverRepository.save(_driver);

            driverCrudDto.setId(id);
            return new ResponseEntity<>(driverCrudDto, HttpStatus.OK);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public ResponseEntity<HttpStatus> deleteDriver(String id) {
        try {
            driverRepository.deleteById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    //
    // Routes
    //
    public ResponseEntity<List<RouteCrudDto>> getAllRoutes() {
        try {
            List<Route> routes = routeRepository.findAll();
            if (routes.isEmpty())
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);

            List<RouteCrudDto> routesCrudDto = new ArrayList<>();
            for (Route route : routes) {
                routesCrudDto.add(new RouteCrudDto(
                        new RouteIdDto(route.getId().getId(), route.getId().getShift()),
                        route.getDesignation(),
                        (route.getDriver() != null) ? route.getDriver().getId() : null,
                        (route.getBus() != null) ? route.getBus().getId() : null,
                        route.getSchedules().stream().map(schedule -> new ScheduleIdDto(new RouteIdDto(schedule.getId().getRouteId().getId(), schedule.getId().getRouteId().getShift()), schedule.getId().getStopId(), schedule.getId().getSequence())).toArray(ScheduleIdDto[]::new)
                ));
            }
            return new ResponseEntity<>(routesCrudDto, HttpStatus.OK);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public ResponseEntity<RouteCrudDto> getRouteByRouteId(String routeId) {
        try {
            String[] split = routeId.split("_");
            RouteId _routeId = new RouteId(split[0], split[1]);
            Optional<Route> route = routeRepository.findByRouteId(_routeId);
            if (route.isEmpty())
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);

            RouteCrudDto routeCrudDto = new RouteCrudDto(
                    new RouteIdDto(route.get().getId().getId(), route.get().getId().getShift()),
                    route.get().getDesignation(),
                    (route.get().getDriver() != null) ? route.get().getDriver().getId() : null,
                    (route.get().getBus() != null) ? route.get().getBus().getId() : null,
                    route.get().getSchedules().stream().map(schedule -> new ScheduleIdDto(new RouteIdDto(schedule.getId().getRouteId().getId(), schedule.getId().getRouteId().getShift()), schedule.getId().getStopId(), schedule.getId().getSequence())).toArray(ScheduleIdDto[]::new)
            );
            return new ResponseEntity<>(routeCrudDto, HttpStatus.OK);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public ResponseEntity<RouteCrudDto> createRoute(RouteCrudDto routeCrudDto) {
        try {
            // Check if route already exists
            Optional<Route> route = routeRepository.findByRouteId(new RouteId(routeCrudDto.getId().getId(), routeCrudDto.getId().getShift()));
            if (route.isPresent())
                return new ResponseEntity<>(HttpStatus.CONFLICT);

            // Check if driver exists
            Driver _driver = null;
            if (routeCrudDto.getDriverId() != null) {
                Optional<Driver> driver = driverRepository.findById(routeCrudDto.getDriverId());
                if (driver.isEmpty())
                    return new ResponseEntity<>(HttpStatus.UNPROCESSABLE_ENTITY);
                _driver = driver.get();
            }

            // Check if bus exists
            Bus _bus = null;
            if (routeCrudDto.getBusId() != null) {
                Optional<Bus> bus = busRepository.findById(routeCrudDto.getBusId());
                if (bus.isEmpty())
                    return new ResponseEntity<>(HttpStatus.UNPROCESSABLE_ENTITY);
                _bus = bus.get();
            }

            // Check if schedules exist
            List<Schedule> _schedules = new ArrayList<>();
            if (routeCrudDto.getSchedulesId() != null) {
                for (ScheduleIdDto scheduleIdDto : routeCrudDto.getSchedulesId()) {
                    Optional<Schedule> _schedule = scheduleRepository.findByScheduleId(new ScheduleId(new RouteId(scheduleIdDto.getRouteId().getId(), scheduleIdDto.getRouteId().getShift()), scheduleIdDto.getStopId(), scheduleIdDto.getSequence()));
                    if (_schedule.isEmpty())
                        return new ResponseEntity<>(HttpStatus.UNPROCESSABLE_ENTITY);
                    _schedules.add(_schedule.get());
                }
            }

            Route _route = new Route(
                    new RouteId(routeCrudDto.getId().getId(), routeCrudDto.getId().getShift()),
                    routeCrudDto.getDesignation(),
                    _driver,
                    _bus,
                    _schedules
            );
            routeRepository.save(_route);

            if (_driver != null) {
                _driver.getRoutes().add(_route);
                driverRepository.save(_driver);
            }

            if (_bus != null) {
                _bus.getRoutes().add(_route);
                busRepository.save(_bus);
            }
            return new ResponseEntity<>(routeCrudDto, HttpStatus.CREATED);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public ResponseEntity<RouteCrudDto> updateRoute(String routeId, RouteCrudDto routeCrudDto) {
        try {
            String[] split = routeId.split("_");
            RouteId _routeId = new RouteId(split[0], split[1]);
            Optional<Route> route = routeRepository.findByRouteId(_routeId);
            if (route.isEmpty())
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);

            // Check if driver exists
            Driver _driver = null;
            if (routeCrudDto.getDriverId() != null) {
                Optional<Driver> driver = driverRepository.findById(routeCrudDto.getDriverId());
                if (driver.isEmpty())
                    return new ResponseEntity<>(HttpStatus.UNPROCESSABLE_ENTITY);
                _driver = driver.get();
            }

            // Check if bus exists
            Bus _bus = null;
            if (routeCrudDto.getBusId() != null) {
                Optional<Bus> bus = busRepository.findById(routeCrudDto.getBusId());
                if (bus.isEmpty())
                    return new ResponseEntity<>(HttpStatus.UNPROCESSABLE_ENTITY);
                _bus = bus.get();
            }

            // Check if schedules exist
            List<Schedule> _schedules = new ArrayList<>();
            if (routeCrudDto.getSchedulesId() != null) {
                for (ScheduleIdDto scheduleIdDto : routeCrudDto.getSchedulesId()) {
                    Optional<Schedule> schedule = scheduleRepository.findByScheduleId(new ScheduleId(new RouteId(scheduleIdDto.getRouteId().getId(), scheduleIdDto.getRouteId().getShift()), scheduleIdDto.getStopId(), scheduleIdDto.getSequence()));
                    if (schedule.isEmpty())
                        return new ResponseEntity<>(HttpStatus.UNPROCESSABLE_ENTITY);
                    _schedules.add(schedule.get());
                }
            }

            Route _route = route.get();
            _route.setDesignation(routeCrudDto.getDesignation());
            _route.setDriver(_driver);
            _route.setBus(_bus);
            _route.setSchedules(_schedules);
            routeRepository.save(_route);

            routeCrudDto.setId(new RouteIdDto(_routeId.getId(), _routeId.getShift()));
            return new ResponseEntity<>(routeCrudDto, HttpStatus.OK);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public ResponseEntity<HttpStatus> deleteRoute(String routeId) {
        try {
            String[] split = routeId.split("_");
            RouteId _routeId = new RouteId(split[0], split[1]);
            routeRepository.deleteByRouteId(_routeId);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    //
    // Schedules
    //
    public ResponseEntity<List<ScheduleCrudDto>> getAllSchedules() {
        try {
            List<Schedule> schedules = scheduleRepository.findAll();
            if (schedules.isEmpty())
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);

            List<ScheduleCrudDto> schedulesCrudDto = new ArrayList<>();
            for (Schedule schedule : schedules) {
                schedulesCrudDto.add(new ScheduleCrudDto(
                        new ScheduleIdDto(
                                new RouteIdDto(schedule.getId().getRouteId().getId(), schedule.getId().getRouteId().getShift()),
                                schedule.getId().getStopId(),
                                schedule.getId().getSequence()
                        ),
                        schedule.getTime()
                ));
            }
            return new ResponseEntity<>(schedulesCrudDto, HttpStatus.OK);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public ResponseEntity<ScheduleCrudDto> getScheduleByScheduleId(String scheduleId) {
        try {
            String[] split = scheduleId.split("_");
            ScheduleId _scheduleId = new ScheduleId(new RouteId(split[0], split[1]), split[2], Integer.parseInt(split[3]));
            Optional<Schedule> schedule = scheduleRepository.findByScheduleId(_scheduleId);
            if (schedule.isEmpty())
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);

            ScheduleCrudDto scheduleCrudDto = new ScheduleCrudDto(
                    new ScheduleIdDto(
                            new RouteIdDto(schedule.get().getId().getRouteId().getId(), schedule.get().getId().getRouteId().getShift()),
                            schedule.get().getId().getStopId(),
                            schedule.get().getId().getSequence()
                    ),
                    schedule.get().getTime()
            );
            return new ResponseEntity<>(scheduleCrudDto, HttpStatus.OK);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public ResponseEntity<ScheduleCrudDto> createSchedule(ScheduleCrudDto scheduleCrudDto) {
        try {
            // Check if schedule already exists
            Optional<Schedule> schedule = scheduleRepository.findByScheduleId(new ScheduleId(new RouteId(scheduleCrudDto.getId().getRouteId().getId(), scheduleCrudDto.getId().getRouteId().getShift()), scheduleCrudDto.getId().getStopId(), scheduleCrudDto.getId().getSequence()));
            if (schedule.isPresent())
                return new ResponseEntity<>(HttpStatus.CONFLICT);

            // Check if route exists
            Route _route = null;
            if (scheduleCrudDto.getId().getRouteId() != null) {
                Optional<Route> route = routeRepository.findByRouteId(new RouteId(scheduleCrudDto.getId().getRouteId().getId(), scheduleCrudDto.getId().getRouteId().getShift()));
                if (route.isEmpty())
                    return new ResponseEntity<>(HttpStatus.UNPROCESSABLE_ENTITY);
                _route = route.get();
            }

            // Check if stop exists
            Stop _stop = null;
            if (scheduleCrudDto.getId().getStopId() != null) {
                Optional<Stop> stop = stopRepository.findById(scheduleCrudDto.getId().getStopId());
                if (stop.isEmpty())
                    return new ResponseEntity<>(HttpStatus.UNPROCESSABLE_ENTITY);
                _stop = stop.get();
            }

            Integer _sequence = scheduleCrudDto.getId().getSequence();

            if (_route == null || _stop == null || _sequence == null)
                return new ResponseEntity<>(HttpStatus.UNPROCESSABLE_ENTITY);

            scheduleRepository.save(new Schedule(
                    new ScheduleId(
                            _route.getId(),
                            _stop.getId(),
                            _sequence
                    ),
                    _route,
                    _stop,
                    scheduleCrudDto.getTime()
            ));
            return new ResponseEntity<>(scheduleCrudDto, HttpStatus.CREATED);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public ResponseEntity<ScheduleCrudDto> updateSchedule(String scheduleId, ScheduleCrudDto scheduleCrudDto) {
        try {
            String[] split = scheduleId.split("_");
            ScheduleId _scheduleId = new ScheduleId(new RouteId(split[0], split[1]), split[2], Integer.parseInt(split[3]));
            Optional<Schedule> schedule = scheduleRepository.findByScheduleId(_scheduleId);
            if (schedule.isEmpty())
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);

            // Check if route exists
            Route _route = null;
            if (scheduleCrudDto.getId().getRouteId() != null) {
                Optional<Route> route = routeRepository.findByRouteId(new RouteId(scheduleCrudDto.getId().getRouteId().getId(), scheduleCrudDto.getId().getRouteId().getShift()));
                if (route.isEmpty())
                    return new ResponseEntity<>(HttpStatus.UNPROCESSABLE_ENTITY);
                _route = route.get();
            }

            // Check if stop exists
            Stop _stop = null;
            if (scheduleCrudDto.getId().getStopId() != null) {
                Optional<Stop> stop = stopRepository.findById(scheduleCrudDto.getId().getStopId());
                if (stop.isEmpty())
                    return new ResponseEntity<>(HttpStatus.UNPROCESSABLE_ENTITY);
                _stop = stop.get();
            }

            Integer _sequence = scheduleCrudDto.getId().getSequence();

            if (_route == null || _stop == null || _sequence == null)
                return new ResponseEntity<>(HttpStatus.UNPROCESSABLE_ENTITY);

            Schedule _schedule = schedule.get();
            _schedule.setRoute(_route);
            _schedule.setStop(_stop);
            _schedule.setTime(scheduleCrudDto.getTime());
            scheduleRepository.save(_schedule);

            scheduleCrudDto.setId(new ScheduleIdDto(
                    new RouteIdDto(_schedule.getId().getRouteId().getId(), _schedule.getId().getRouteId().getShift()),
                    _schedule.getId().getStopId(),
                    _schedule.getId().getSequence()
            ));
            return new ResponseEntity<>(scheduleCrudDto, HttpStatus.OK);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public ResponseEntity<HttpStatus> deleteSchedule(String scheduleId) {
        try {
            String[] split = scheduleId.split("_");
            ScheduleId _scheduleId = new ScheduleId(new RouteId(split[0], split[1]), split[2], Integer.parseInt(split[3]));
            scheduleRepository.deleteByScheduleId(_scheduleId);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    //
    // Stop
    //
    public ResponseEntity<List<StopCrudDto>> getAllStops() {
        try {
            List<Stop> stops = stopRepository.findAll();
            if (stops.isEmpty())
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);

            List<StopCrudDto> stopsCrudDto = new ArrayList<>();
            for (Stop stop : stops) {
                stopsCrudDto.add(new StopCrudDto(
                        stop.getId(),
                        stop.getDesignation(),
                        new Double[]{stop.getLat(), stop.getLon()},
                        stop.getSchedules().stream().map(schedule -> new ScheduleIdDto(new RouteIdDto(schedule.getId().getRouteId().getId(), schedule.getId().getRouteId().getShift()), schedule.getId().getStopId(), schedule.getId().getSequence())).toArray(ScheduleIdDto[]::new)
                ));
            }
            return new ResponseEntity<>(stopsCrudDto, HttpStatus.OK);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public ResponseEntity<StopCrudDto> getStopById(String id) {
        try {
            Optional<Stop> stop = stopRepository.findById(id);
            if (stop.isEmpty())
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);

            StopCrudDto stopCrudDto = new StopCrudDto(
                    stop.get().getId(),
                    stop.get().getDesignation(),
                    new Double[]{stop.get().getLat(), stop.get().getLon()},
                    stop.get().getSchedules().stream().map(schedule -> new ScheduleIdDto(new RouteIdDto(schedule.getId().getRouteId().getId(), schedule.getId().getRouteId().getShift()), schedule.getId().getStopId(), schedule.getId().getSequence())).toArray(ScheduleIdDto[]::new)
            );
            return new ResponseEntity<>(stopCrudDto, HttpStatus.OK);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public ResponseEntity<StopCrudDto> createStop(StopCrudDto stopCrudDto) {
        try {
            // Check if stop already exists
            Optional<Stop> stop = stopRepository.findById(stopCrudDto.getId());
            if (stop.isPresent())
                return new ResponseEntity<>(HttpStatus.CONFLICT);

            // Check if schedules exist
            List<Schedule> _schedules = new ArrayList<>();
            if (stopCrudDto.getSchedulesId() != null) {
                for (ScheduleIdDto scheduleIdDto : stopCrudDto.getSchedulesId()) {
                    Optional<Schedule> _schedule = scheduleRepository.findByScheduleId(new ScheduleId(new RouteId(scheduleIdDto.getRouteId().getId(), scheduleIdDto.getRouteId().getShift()), scheduleIdDto.getStopId(), scheduleIdDto.getSequence()));
                    if (_schedule.isEmpty())
                        return new ResponseEntity<>(HttpStatus.UNPROCESSABLE_ENTITY);
                    _schedules.add(_schedule.get());
                }
            }

            stopRepository.save(new Stop(
                    stopCrudDto.getId(),
                    stopCrudDto.getDesignation(),
                    stopCrudDto.getPosition()[0],
                    stopCrudDto.getPosition()[1],
                    _schedules
            ));
            return new ResponseEntity<>(stopCrudDto, HttpStatus.CREATED);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public ResponseEntity<StopCrudDto> updateStop(String id, StopCrudDto stopCrudDto) {
        try {
            Optional<Stop> stop = stopRepository.findById(id);
            if (stop.isEmpty())
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);

            // Check if schedules exist
            List<Schedule> _schedules = new ArrayList<>();
            if (stopCrudDto.getSchedulesId() != null) {
                for (ScheduleIdDto scheduleIdDto : stopCrudDto.getSchedulesId()) {
                    Optional<Schedule> _schedule = scheduleRepository.findByScheduleId(new ScheduleId(new RouteId(scheduleIdDto.getRouteId().getId(), scheduleIdDto.getRouteId().getShift()), scheduleIdDto.getStopId(), scheduleIdDto.getSequence()));
                    if (_schedule.isEmpty())
                        return new ResponseEntity<>(HttpStatus.UNPROCESSABLE_ENTITY);
                    _schedules.add(_schedule.get());
                }
            }

            Stop _stop = stop.get();
            _stop.setDesignation(stopCrudDto.getDesignation());
            _stop.setLat(stopCrudDto.getPosition()[0]);
            _stop.setLon(stopCrudDto.getPosition()[1]);
            _stop.setSchedules(_schedules);
            stopRepository.save(_stop);

            stopCrudDto.setId(id);
            return new ResponseEntity<>(stopCrudDto, HttpStatus.OK);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public ResponseEntity<HttpStatus> deleteStop(String id) {
        try {
            stopRepository.deleteById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    //
    // Users
    //
    public ResponseEntity<List<UserCrudDto>> getAllUsers() {
        try {
            List<User> users = userRepository.findAll();
            if (users.isEmpty())
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);

            List<UserCrudDto> usersCrudDto = new ArrayList<>();
            for (User user : users) {
                usersCrudDto.add(new UserCrudDto(
                        user.getUsername(),
                        user.getPassword()
                ));
            }
            return new ResponseEntity<>(usersCrudDto, HttpStatus.OK);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public ResponseEntity<UserCrudDto> getUserByUsername(String username) {
        try {
            Optional<User> user = userRepository.findByUsername(username);
            if (user.isEmpty())
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);

            UserCrudDto userCrudDto = new UserCrudDto(
                    user.get().getUsername(),
                    user.get().getPassword()
            );
            return new ResponseEntity<>(userCrudDto, HttpStatus.OK);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public ResponseEntity<UserCrudDto> createUser(UserCrudDto userCrudDto) {
        try {
            // Check if user already exists
            Optional<User> user = userRepository.findByUsername(userCrudDto.getUsername());
            if (user.isPresent())
                return new ResponseEntity<>(HttpStatus.CONFLICT);

            userRepository.save(new User(
                    userCrudDto.getUsername(),
                    userCrudDto.getPassword()
            ));
            return new ResponseEntity<>(userCrudDto, HttpStatus.CREATED);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public ResponseEntity<UserCrudDto> updateUser(String username, UserCrudDto userCrudDto) {
        try {
            Optional<User> user = userRepository.findByUsername(username);
            if (user.isEmpty())
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);

            User _user = user.get();
            _user.setPassword(userCrudDto.getPassword());
            userRepository.save(_user);

            userCrudDto.setUsername(username);
            return new ResponseEntity<>(userCrudDto, HttpStatus.OK);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public ResponseEntity<HttpStatus> deleteUser(String username) {
        try {
            userRepository.deleteByUsername(username);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
