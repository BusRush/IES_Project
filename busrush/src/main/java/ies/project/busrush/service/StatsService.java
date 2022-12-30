package ies.project.busrush.service;

import ies.project.busrush.dto.stats.DayDelayDto;
import ies.project.busrush.repository.BusRepository;
import ies.project.busrush.repository.cassandra.BusMetricsRepository;
import org.apache.tomcat.util.digester.ArrayStack;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.List;

@Service
public class StatsService {

    private BusRepository busRepository;
    private BusMetricsRepository busMetricsRepository;

    @Autowired
    public StatsService(
            BusRepository busRepository,
            BusMetricsRepository busMetricsRepository
    ) {
        this.busRepository = busRepository;
        this.busMetricsRepository = busMetricsRepository;
    }

    public ResponseEntity<List<DayDelayDto>> getDayDelays(String from, String to) {
        List<DayDelayDto> dayDelaysDto = new ArrayList<>();

        LocalDate fromDate = LocalDate.parse(from);
        LocalDate toDate = LocalDate.parse(to);

        Long fromTs = fromDate.atStartOfDay().toEpochSecond(ZoneOffset.ofHours(0));
        Long toTs = toDate.atStartOfDay().toEpochSecond(ZoneOffset.ofHours(0)) + 86400;

        Long middleTs = fromTs;
        Integer count = 0;
        while (middleTs < toTs) {
            middleTs += 86400;
            Integer delayed = busMetricsRepository.findAllDelayed(fromTs, middleTs).size();
            Integer onTime = busRepository.findAll().size() - delayed;

            DayDelayDto dayDelayDto = new DayDelayDto(fromDate.plusDays(count), delayed, onTime);
            dayDelaysDto.add(dayDelayDto);

            fromTs = middleTs;
            count++;
        }

        return new ResponseEntity<>(dayDelaysDto, HttpStatus.OK);
    }
}
