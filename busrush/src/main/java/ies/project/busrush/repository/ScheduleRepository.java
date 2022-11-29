package ies.project.busrush.repository;

import ies.project.busrush.model.Schedule;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;

@Repository
public interface ScheduleRepository extends JpaRepository<Schedule, String> {
}
