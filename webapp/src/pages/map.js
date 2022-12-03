import Head from 'next/head';
import { Box, Container, Grid } from '@mui/material';
import { DashboardLayout } from '../components/dashboard-layout';
import { MapWidget } from '../components/map/map-widget';
import { busesLive } from '../__mocks__/buses-live';
import { busRoutes } from '../__mocks__/bus-routes';
import { Component } from 'react';
import { BusMetrics } from '../components/map/bus-metrics';

class Page extends Component {

  constructor(props) {
    super(props);
    this.state = {
      buses: busesLive,
      routes: busRoutes,
      selectedBus: null
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
  };

  updateSelectedBus = (id) => {
    console.log('id:' + id);
    const bus = this.state.buses.find(bus => bus.id === id);
    this.setState({ selectedBus: bus });
  };

// Executes after the component is mounted in the DOM
  componentDidMount = () => {
    setInterval(() => {
      this.updateBuses();
    }, 5000);
  };

  render = () => {
    const { buses, routes, selectedBus } = this.state;

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
                  routes={routes}
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
