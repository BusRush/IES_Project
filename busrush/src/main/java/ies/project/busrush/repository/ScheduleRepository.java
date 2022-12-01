package ies.project.busrush.repository;

import ies.project.busrush.model.Schedule;
import ies.project.busrush.model.ScheduleId;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ScheduleRepository extends JpaRepository<Schedule, String> {
    @Query("SELECT s FROM Schedule s WHERE s.id = :scheduleId")
    Optional<Schedule> findByScheduleId(ScheduleId scheduleId);

    @Query("DELETE FROM Schedule s WHERE s.id = :scheduleId")
    void deleteByScheduleId(ScheduleId scheduleId);

    @Query("SELECT s " +
            "FROM Schedule s " +
            "WHERE s.stop.id = :stopId " +
            "AND s.time >= :currentTime " +
            "ORDER BY s.time")
    List<Schedule> findSchedulesByStopAndCurrentTime(String stopId, LocalTime currentTime);

    @Query("SELECT s1 " +
            "FROM Schedule s1 " +
            "INNER JOIN Schedule s2 ON s1.route.id = s2.route.id " +
            "WHERE s1.stop.id = :originStopId AND s2.stop.id = :destinationStopId " +
            "AND s1.time >= :currentTime AND s1.time <= s2.time " +
            "ORDER BY s1.time")
    List<Schedule> findSchedulesByOriginStopAndDestinationStopAndCurrentTime(String originStopId, String destinationStopId, LocalTime currentTime);
}
