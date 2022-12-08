import 'leaflet/dist/leaflet.css';

import { useState } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import { MarkerBusIcon, MarkerStopIcon } from './marker-icon';

const MapWidget = (props) => {

  const [center, setCenter] = useState([40.64, -8.65]);
  const [map, setMap] = useState(null);
  const [zoom, setZoom] = useState(14);
  const { buses, routes, updateSelectedBus } = props;

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      style={{ width: '100%', height: '50vh' }}
      whenCreated={map => setMap(map)}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {routes.map((route) => (
        route.stops.map((stop) => (
          <MarkerStopIcon
            key={stop.id}
            name={stop.name}
            position={stop.position}
          />))
      ))}
      {buses.map((bus) => (
        <MarkerBusIcon
          key={bus.id}
          busId={bus.id}
          name={bus.name}
          position={bus.metrics.position}
          updateSelectedBus={updateSelectedBus}
        />
      ))}
    </MapContainer>
  );
};
export default MapWidget;
