package ies.project.busrush.util;

import ies.project.busrush.dto.osrm.TableServiceDto;
import ies.project.busrush.model.Stop;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;
import java.util.List;

public class OSRMAdapter {
    private static final String URI = "http://router.project-osrm.org/table/v1/driving/"; // TODO: Connect to local server

    public static Double getDuration(Double latA, Double lonA, Double latB, Double lonB) {

        // Build the request
        StringBuilder sb = new StringBuilder(URI);
        sb.append(lonA).append(",").append(latA).append(';')
                .append(lonB).append(",").append(latB);
        sb.append("?sources=0");
        String req = sb.toString();

        // Send the request
        RestTemplate restTemplate = new RestTemplate();
        TableServiceDto res = restTemplate.getForObject(req, TableServiceDto.class);
        assert res != null; // TODO: Handle this

        return res.getDurations().get(0).get(1);
    }

    public static StopDuration getNextStop(Double lat, Double lon, List<Stop> stops) {

        // Build the request
        StringBuilder sb = new StringBuilder(URI);
        sb.append(lon).append(",").append(lat);
        for (Stop stop : stops)
            sb.append(';').append(stop.getLon()).append(",").append(stop.getLat());
        sb.append("?sources=0");
        String req = sb.toString();

        // Send the request
        RestTemplate restTemplate = new RestTemplate();
        TableServiceDto res = restTemplate.getForObject(req, TableServiceDto.class);
        assert res != null; // TODO: Handle this

        // Index durations according to stops
        List<Double> durations = res.getDurations().get(0)
                .subList(1, res.getDurations().get(0).size());

        // Get the next stop and the duration to reach it
        int index = durations.indexOf(Collections.min(durations));
        return new StopDuration(stops.get(index), durations.get(index));
    }
}
