package ies.project.busrush.controller;

import ies.project.busrush.dto.crud.*;
import ies.project.busrush.service.CrudService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class CrudController {

    @Autowired
    private CrudService crudService;

    //
    // Buses
    //
    @GetMapping("/buses")
    public ResponseEntity<List<BusCrudDto>> getAllBuses() {
        return crudService.getAllBuses();
    }

    @GetMapping("/buses/{id}")
    public ResponseEntity<BusCrudDto> getBusById(@PathVariable("id") String id) {
        return crudService.getBusById(id);
    }

    @PostMapping("/buses")
    public ResponseEntity<BusCrudDto> createBus(@RequestBody BusCrudDto busCrudDto) {
        return crudService.createBus(busCrudDto);
    }

    @PutMapping("/buses/{id}")
    public ResponseEntity<BusCrudDto> updateBus(@PathVariable("id") String id, @RequestBody BusCrudDto busCrudDto) {
        return crudService.updateBus(id, busCrudDto);
    }

    @DeleteMapping("/buses/{id}")
    public ResponseEntity<HttpStatus> deleteBus(@PathVariable("id") String id) {
        return crudService.deleteBus(id);
    }

    //
    // Devices
    //
    @GetMapping("/devices")
    public ResponseEntity<List<DeviceCrudDto>> getAllDevices() {
        return crudService.getAllDevices();
    }

    @GetMapping("/devices/{id}")
    public ResponseEntity<DeviceCrudDto> getDeviceById(@PathVariable("id") String id) {
        return crudService.getDeviceById(id);
    }

    @PostMapping("/devices")
    public ResponseEntity<DeviceCrudDto> createDevice(@RequestBody DeviceCrudDto deviceCrudDto) {
        return crudService.createDevice(deviceCrudDto);
    }

    @PutMapping("/devices/{id}")
    public ResponseEntity<DeviceCrudDto> updateDevice(@PathVariable("id") String id, @RequestBody DeviceCrudDto deviceCrudDto) {
        return crudService.updateDevice(id, deviceCrudDto);
    }

    @DeleteMapping("/devices/{id}")
    public ResponseEntity<HttpStatus> deleteDevice(@PathVariable("id") String id) {
        return crudService.deleteDevice(id);
    }

    //
    // Drivers
    //
    @GetMapping("/drivers")
    public ResponseEntity<List<DriverCrudDto>> getAllDrivers() {
        return crudService.getAllDrivers();
    }

    @GetMapping("/drivers/{id}")
    public ResponseEntity<DriverCrudDto> getDriverById(@PathVariable("id") String id) {
        return crudService.getDriverById(id);
    }

    @PostMapping("/drivers")
    public ResponseEntity<DriverCrudDto> createDriver(@RequestBody DriverCrudDto driverCrudDto) {
        return crudService.createDriver(driverCrudDto);
    }

    @PutMapping("/drivers/{id}")
    public ResponseEntity<DriverCrudDto> updateDriver(@PathVariable("id") String id, @RequestBody DriverCrudDto driverCrudDto) {
        return crudService.updateDriver(id, driverCrudDto);
    }

    @DeleteMapping("/drivers/{id}")
    public ResponseEntity<HttpStatus> deleteDriver(@PathVariable("id") String id) {
        return crudService.deleteDriver(id);
    }

    //
    // Routes
    //
    @GetMapping("/routes")
    public ResponseEntity<List<RouteCrudDto>> getAllRoutes() {
        return crudService.getAllRoutes();
    }

    @GetMapping("/routes/{routeId}")
    public ResponseEntity<RouteCrudDto> getRouteByRouteId(@PathVariable("routeId") String routeId) {
        return crudService.getRouteByRouteId(routeId);
    }

    @PostMapping("/routes")
    public ResponseEntity<RouteCrudDto> createRoute(@RequestBody RouteCrudDto routeCrudDto) {
        return crudService.createRoute(routeCrudDto);
    }

    @PutMapping("/routes/{routeId}")
    public ResponseEntity<RouteCrudDto> updateRoute(@PathVariable("routeId") String routeId, @RequestBody RouteCrudDto routeCrudDto) {
        return crudService.updateRoute(routeId, routeCrudDto);
    }

    @DeleteMapping("/routes/{routeId}")
    public ResponseEntity<HttpStatus> deleteRoute(@PathVariable("routeId") String routeId) {
        return crudService.deleteRoute(routeId);
    }

    //
    // Schedules
    //
    @GetMapping("/schedules")
    public ResponseEntity<List<ScheduleCrudDto>> getAllSchedules() {
        return crudService.getAllSchedules();
    }

    @GetMapping("/schedules/{scheduleId}")
    public ResponseEntity<ScheduleCrudDto> getScheduleByScheduleId(@PathVariable("scheduleId") String scheduleId) {
        return crudService.getScheduleByScheduleId(scheduleId);
    }

    @PostMapping("/schedules")
    public ResponseEntity<ScheduleCrudDto> createSchedule(@RequestBody ScheduleCrudDto scheduleCrudDto) {
        return crudService.createSchedule(scheduleCrudDto);
    }

    @PutMapping("/schedules/{scheduleId}")
    public ResponseEntity<ScheduleCrudDto> updateSchedule(@PathVariable("scheduleId") String scheduleId, @RequestBody ScheduleCrudDto scheduleCrudDto) {
        return crudService.updateSchedule(scheduleId, scheduleCrudDto);
    }

    @DeleteMapping("/schedules/{scheduleId}")
    public ResponseEntity<HttpStatus> deleteSchedule(@PathVariable("scheduleId") String scheduleId) {
        return crudService.deleteSchedule(scheduleId);
    }

    //
    // Stops
    //
    @GetMapping("/stops")
    public ResponseEntity<List<StopCrudDto>> getAllStops() {
        return crudService.getAllStops();
    }

    @GetMapping("/stops/{id}")
    public ResponseEntity<StopCrudDto> getStopById(@PathVariable("id") String id) {
        return crudService.getStopById(id);
    }

    @PostMapping("/stops")
    public ResponseEntity<StopCrudDto> createStop(@RequestBody StopCrudDto stopCrudDto) {
        return crudService.createStop(stopCrudDto);
    }

    @PutMapping("/stops/{id}")
    public ResponseEntity<StopCrudDto> updateStop(@PathVariable("id") String id, @RequestBody StopCrudDto stopCrudDto) {
        return crudService.updateStop(id, stopCrudDto);
    }

    @DeleteMapping("/stops/{id}")
    public ResponseEntity<HttpStatus> deleteStop(@PathVariable("id") String id) {
        return crudService.deleteStop(id);
    }

    //
    // Users
    //
    @GetMapping("/users")
    public ResponseEntity<List<UserCrudDto>> getAllUsers() {
        return crudService.getAllUsers();
    }

    @GetMapping("/users/{username}")
    public ResponseEntity<UserCrudDto> getUserByUsername(@PathVariable("username") String username) {
        return crudService.getUserByUsername(username);
    }

    @PostMapping("/users")
    public ResponseEntity<UserCrudDto> createUser(@RequestBody UserCrudDto userCrudDto) {
        return crudService.createUser(userCrudDto);
    }

    @PutMapping("/users/{username}")
    public ResponseEntity<UserCrudDto> updateUser(@PathVariable("username") String username, @RequestBody UserCrudDto userCrudDto) {
        return crudService.updateUser(username, userCrudDto);
    }

    @DeleteMapping("/users/{username}")
    public ResponseEntity<HttpStatus> deleteUser(@PathVariable("username") String username) {
        return crudService.deleteUser(username);
    }
}
