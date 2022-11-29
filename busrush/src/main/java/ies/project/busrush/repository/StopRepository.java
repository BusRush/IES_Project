package ies.project.busrush.repository;

import ies.project.busrush.model.Stop;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;

@Repository
public interface StopRepository extends JpaRepository<Stop, String> {
}
