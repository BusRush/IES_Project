package ies.project.busrush.model;

import java.io.Serializable;

public class ScheduleID implements Serializable {
    private Route route;
    private Stop stop;

    public ScheduleID(Route route, Stop stop) {
        this.route = route;
        this.stop = stop;
    }
    
    public void setRoute(Route route) {
        this.route = route;
    }
    public void setStop(Stop stop) {
        this.stop = stop;
    }

    public Route getRoute() {
        return route;
    }
    public Stop getStop() {
        return stop;
    }
}
