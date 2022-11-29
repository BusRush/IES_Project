package ies.project.busrush.repository;

import ies.project.busrush.model.Route;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;

@Repository
public interface RouteRepository extends JpaRepository<Route, String> {
}
