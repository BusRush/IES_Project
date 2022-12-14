package ies.project.busrush.model.cassandra;

// {'device_id': 'AVRBUS-D0001', 'route_id': 'AVRBUS-L04', 'route_shift': '083000', 'timestamp': 1670868915, 'position': [40.63554147, -8.65516931], 'speed': 15.156, 'fuel': 98.878, 'passengers': 15}

public class BusMetrics {
    private String bus_id;
    private Long timestamp;
    private String route_id;
    private String route_shift;
    private String device_id;
    private String[] position;
    private Double speed;
    private Double fuel;
    private int passengers;

    public BusMetrics(String bus_id, Long timestamp, String route_id, String route_shift, String device_id, String[] position, Double speed, Double fuel, int passengers) {
        this.bus_id = bus_id;
        this.timestamp = timestamp;
        this.route_id = route_id;
        this.route_shift = route_shift;
        this.device_id = device_id;
        this.position = position;
        this.speed = speed;
        this.fuel = fuel;
        this.passengers = passengers;
    }

    public Long getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Long timestamp) {
        this.timestamp = timestamp;
    }

    public String getBus_id() {
        return bus_id;
    }

    public void setBus_id(String bus_id) {
        this.bus_id = bus_id;
    }

    public String getRoute_id() {
        return route_id;
    }

    public void setRoute_id(String route_id) {
        this.route_id = route_id;
    }

    public String getRoute_shift() {
        return route_shift;
    }

    public void setRoute_shift(String route_shift) {
        this.route_shift = route_shift;
    }

    public String getDevice_id() {
        return device_id;
    }

    public void setDevice_id(String device_id) {
        this.device_id = device_id;
    }

    public String[] getPosition() {
        return position;
    }

    public void setPosition(String[] position) {
        this.position = position;
    }

    public Double getSpeed() {
        return speed;
    }

    public void setSpeed(Double speed) {
        this.speed = speed;
    }

    public Double getFuel() {
        return fuel;
    }

    public void setFuel(Double fuel) {
        this.fuel = fuel;
    }

    public int getPassengers() {
        return passengers;
    }

    public void setPassengers(int passengers) {
        this.passengers = passengers;
    }

}