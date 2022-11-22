import 'leaflet/dist/leaflet.css';

import { Component } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import { MarkerBusIcon, MarkerStopIcon } from './marker-icon';
import { busRoutes } from '../../__mocks__/bus-routes';
import { busesLive } from '../../__mocks__/buses-live';

export class MapWidget extends Component {

  constructor(props) {
    super(props);
    this.state = {
      buses: busesLive,
      center: [40.64, -8.65], // [lat, lng]
      map: null,
      routes: busRoutes,
      zoom: 14
    };
  }

  // TODO: call the API
  updateBuses = () => {
    const { buses } = this.state;
    this.setState({
      buses: buses.map(bus => ({
        ...bus,
        metrics: {
          ...bus.metrics,
          position: [bus.metrics.position[0] + 0.0001, bus.metrics.position[1] + 0.0001]
        }
      }))
    });
  }

  // Executes after the component is mounted in the DOM
  componentDidMount = () => {
    setInterval(() => {
      this.updateBuses();
    }, 5000);
  };

  render = () => {
    const { buses, center, routes, zoom } = this.state;

    return (
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ width: '100%', height: '50vh' }}
        whenCreated={map => this.setState({ map })}
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
            name={bus.name}
            position={bus.metrics.position}
          />
        ))}
      </MapContainer>
    );
  };
}
