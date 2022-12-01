package ies.project.busrush.controller;

import ies.project.busrush.dto.crud.BusCrudDto;
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
}
