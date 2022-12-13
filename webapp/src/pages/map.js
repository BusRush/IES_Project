import Head from 'next/head';
import { Component } from 'react';
import { Box, Container, Grid } from '@mui/material';
import dynamic from 'next/dynamic';
import Stomp from 'stompjs';
import { DashboardLayout } from '../components/dashboard-layout';
// import { MapWidget } from '../components/map/map-widget';
const MapWidget = dynamic(() => import('../components/map/map-widget'), { ssr: false });
import { busesLive } from '../__mocks__/buses-live';
import { busRoutes } from '../__mocks__/bus-routes';
import { BusMetrics } from '../components/map/bus-metrics';

class Page extends Component {

  constructor(props) {
    super(props);
    this.state = {
      buses: {},
      stops: [],
      selectedBus: null
    };
  }

// Executes after the component is mounted in the DOM
  componentDidMount = () => {
    this.fetchStops();
    // Setup buses
    const stomp = Stomp.client('ws://localhost:15674/ws');
    const headers = {
      'login': 'guest',
      'passcode': 'guest',
      'durable': true,
      'auto-delete': false
    };
    stomp.connect(headers, () => {
        stomp.subscribe('/queue/devices', (msg) => {
          this.updateBuses(JSON.parse(msg.body));
        });
      },
      (err) => {
        console.log(err);
      });
  };

  updateBuses = (bus) => {
    const { buses } = this.state;
    buses[bus.device_id] = {
      routeId: bus.route_id,
      routeShift: bus.route_shift,
      timestamp: bus.timestamp,
      position: bus.position,
      speed: bus.speed,
      fuel: bus.fuel,
      passengers: bus.passengers
    };
    this.setState({ buses: buses });
  };

  fetchStops = () => {
    fetch('http://localhost:8080/api/stops')
      .then(res => res.json())
      .then(stops => this.setState({ stops: stops } ))
      .catch(err => console.log(err));
  };

  updateSelectedBus = (id) => {
    console.log('id:' + id);
    const bus = this.state.buses.find(bus => bus.id === id);
    this.setState({ selectedBus: bus });
  };

  render = () => {
    const { buses, stops, selectedBus } = this.state;
    console.log(stops)
    return (
      <>
        <Head>
          <title>
            Dashboard | Material Kit
          </title>
        </Head>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            py: 3
          }}
        >
          <Container maxWidth={false}>
            <Grid
              container
              spacing={3}
            >
              <Grid
                item
                xs={12}
                sm={12}
                lg={8}
                xl={8}
              >
                <MapWidget
                  buses={buses}
                  stops={stops}
                  updateSelectedBus={this.updateSelectedBus}
                />
              </Grid>
              <Grid
                item
                xs={12}
                sm={12}
                lg={4}
                xl={4}
              >
                <BusMetrics
                  bus={selectedBus}
                />
              </Grid>
            </Grid>
          </Container>;
          ;
        </Box>
      </>
    );
  };
}

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;
