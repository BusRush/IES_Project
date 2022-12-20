package ies.project.busrush.repository;

import ies.project.busrush.model.Bus;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;

@Repository
public interface BusRepository extends JpaRepository<Bus, String> {
    String findIdByDeviceId(String deviceId);
}
